import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import {
  CfnOutput,
  CustomResource,
  Duration,
  Fn,
  RemovalPolicy,
  Stack,
  type StackProps,
} from 'aws-cdk-lib';
import {
  AllowedMethods,
  CacheCookieBehavior,
  CacheHeaderBehavior,
  CachePolicy,
  CacheQueryStringBehavior,
  CachedMethods,
  Distribution,
  Function as CloudFrontFunction,
  FunctionCode,
  FunctionEventType,
  type BehaviorOptions,
  type IOrigin,
  OriginRequestPolicy,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin, S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { AttributeType, BillingMode, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { type IGrantable } from 'aws-cdk-lib/aws-iam';
import {
  Architecture,
  Code,
  Function as LambdaFunction,
  FunctionUrlAuthType,
  InvokeMode,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

type BaseFunction = {
  handler: string;
  bundle: string;
};

type OpenNextFunctionOrigin = BaseFunction & {
  type: 'function';
  streaming?: boolean;
};

type OpenNextS3Origin = {
  type: 's3';
  originPath: string;
  copy: {
    from: string;
    to: string;
    cached: boolean;
    versionedSubDir?: string;
  }[];
};

type OpenNextOrigin = OpenNextFunctionOrigin | OpenNextS3Origin;

type OpenNextOutput = {
  origins: {
    s3: OpenNextS3Origin;
    default: OpenNextFunctionOrigin;
    imageOptimizer?: OpenNextFunctionOrigin;
    [key: string]: OpenNextOrigin | undefined;
  };
  behaviors: {
    pattern: string;
    origin?: string;
  }[];
  additionalProps?: {
    initializationFunction?: BaseFunction;
    revalidationFunction?: BaseFunction;
  };
};

interface ClientStageOpenNextStackProps extends StackProps {
  stageName: string;
  appPath: string;
  openNextPath: string;
}

export class ClientStageOpenNextStack extends Stack {
  private readonly appRootPath: string;
  private readonly openNextPath: string;
  private readonly openNextOutput: OpenNextOutput;
  private readonly appEnvironment: Record<string, string>;
  private readonly bucket: Bucket;
  private readonly table: Table;
  private readonly queue: Queue;
  private readonly serverCachePolicy: CachePolicy;
  private readonly staticCachePolicy = CachePolicy.CACHING_OPTIMIZED;

  public readonly distribution: Distribution;

  constructor(scope: Construct, id: string, props: ClientStageOpenNextStackProps) {
    super(scope, id, props);

    this.appRootPath = this.resolveFromInfraRoot(props.appPath);
    this.openNextPath = this.resolveFromInfraRoot(props.openNextPath);
    this.openNextOutput = this.readOpenNextOutput();
    this.appEnvironment = this.readAppEnvironment();

    this.bucket = this.createBucket(props.stageName);
    this.table = this.createRevalidationTable(props.stageName);
    this.queue = this.createRevalidationQueue(props.stageName);
    this.serverCachePolicy = this.createServerCachePolicy();

    this.createRevalidationConsumer();
    this.createInitializationFunction();

    const origins = this.createOrigins();
    this.distribution = this.createDistribution(origins);

    new CfnOutput(this, 'ClientStageCloudFrontDomainName', {
      value: this.distribution.distributionDomainName,
    });
    new CfnOutput(this, 'ClientStageCloudFrontDistributionId', {
      value: this.distribution.distributionId,
    });
    new CfnOutput(this, 'ClientStageAssetBucketName', {
      value: this.bucket.bucketName,
    });
  }

  private resolveFromInfraRoot(relativeOrAbsolutePath: string) {
    if (path.isAbsolute(relativeOrAbsolutePath)) {
      return relativeOrAbsolutePath;
    }

    return path.resolve(process.cwd(), relativeOrAbsolutePath);
  }

  private resolveAssetPath(assetPath: string) {
    if (path.isAbsolute(assetPath)) {
      return assetPath;
    }

    const appRelativePath = path.resolve(this.appRootPath, assetPath);
    if (existsSync(appRelativePath)) {
      return appRelativePath;
    }

    return path.resolve(this.openNextPath, assetPath);
  }

  private readOpenNextOutput() {
    const outputPath = path.join(this.openNextPath, 'open-next.output.json');
    if (!existsSync(outputPath)) {
      throw new Error(
        `OpenNext output was not found at ${outputPath}. Run pnpm --filter client build:opennext before CDK deploy.`,
      );
    }

    return JSON.parse(readFileSync(outputPath, 'utf-8')) as OpenNextOutput;
  }

  private readAppEnvironment() {
    const envPath = path.join(this.appRootPath, '.env');
    if (!existsSync(envPath)) {
      return {};
    }

    return readFileSync(envPath, 'utf-8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .reduce<Record<string, string>>((env, line) => {
        const separatorIndex = line.indexOf('=');
        if (separatorIndex < 1) {
          return env;
        }

        const key = line.slice(0, separatorIndex).trim();
        const rawValue = line.slice(separatorIndex + 1).trim();
        if (!key.startsWith('NEXT_PUBLIC_')) {
          return env;
        }

        env[key] = rawValue.replace(/^['"]|['"]$/g, '');
        return env;
      }, {});
  }

  private createBucket(stageName: string) {
    return new Bucket(this, 'OpenNextBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: stageName === 'stage' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      autoDeleteObjects: stageName === 'stage',
    });
  }

  private createRevalidationTable(stageName: string) {
    const table = new Table(this, 'RevalidationTable', {
      partitionKey: { name: 'tag', type: AttributeType.STRING },
      sortKey: { name: 'path', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
      removalPolicy: stageName === 'stage' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'revalidate',
      partitionKey: { name: 'path', type: AttributeType.STRING },
      sortKey: { name: 'revalidatedAt', type: AttributeType.NUMBER },
      projectionType: ProjectionType.ALL,
    });

    return table;
  }

  private createRevalidationQueue(stageName: string) {
    return new Queue(this, 'RevalidationQueue', {
      fifo: true,
      receiveMessageWaitTime: Duration.seconds(20),
      retentionPeriod: Duration.days(4),
      removalPolicy: stageName === 'stage' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    });
  }

  private createRevalidationConsumer() {
    const revalidationFunction = this.openNextOutput.additionalProps?.revalidationFunction;
    if (!revalidationFunction?.bundle) {
      return;
    }

    const consumer = this.createLambdaFunction('RevalidationFunction', revalidationFunction, {
      timeout: Duration.seconds(30),
      memorySize: 512,
    });
    this.grantRuntimePermissions(consumer);
    consumer.addEventSource(new SqsEventSource(this.queue, { batchSize: 5 }));
  }

  private createInitializationFunction() {
    const initializationFunction = this.openNextOutput.additionalProps?.initializationFunction;
    if (!initializationFunction?.bundle) {
      return;
    }

    const insertFunction = this.createLambdaFunction(
      'RevalidationInsertFunction',
      initializationFunction,
      {
        timeout: Duration.minutes(15),
        memorySize: 128,
      },
    );
    this.grantRuntimePermissions(insertFunction);

    const providerLogGroup = new LogGroup(this, 'RevalidationProviderLogGroup', {
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const provider = new Provider(this, 'RevalidationProvider', {
      onEventHandler: insertFunction,
      logGroup: providerLogGroup,
    });

    new CustomResource(this, 'RevalidationResource', {
      serviceToken: provider.serviceToken,
      properties: {
        version: Date.now().toString(),
      },
    });
  }

  private createOrigins() {
    const origins: Record<string, IOrigin> = {
      s3: S3BucketOrigin.withOriginAccessControl(this.bucket, {
        originPath: this.openNextOutput.origins.s3.originPath,
      }),
      default: this.createFunctionOrigin('Default', this.openNextOutput.origins.default),
    };

    this.openNextOutput.origins.s3.copy.forEach((copy, index) => {
      new BucketDeployment(this, `OpenNextBucketDeployment${index}${this.toConstructId(copy.to)}`, {
        sources: [Source.asset(this.resolveAssetPath(copy.from))],
        destinationBucket: this.bucket,
        destinationKeyPrefix: copy.to,
        prune: false,
      });
    });

    const imageOptimizer = this.openNextOutput.origins.imageOptimizer;
    if (imageOptimizer?.type === 'function') {
      origins.imageOptimizer = this.createFunctionOrigin('ImageOptimizer', imageOptimizer);
    }

    Object.entries(this.openNextOutput.origins).forEach(([key, origin]) => {
      if (
        key === 's3' ||
        key === 'default' ||
        key === 'imageOptimizer' ||
        origin?.type !== 'function'
      ) {
        return;
      }

      origins[key] = this.createFunctionOrigin(this.toConstructId(key), origin);
    });

    return origins;
  }

  private createFunctionOrigin(idPrefix: string, origin: OpenNextFunctionOrigin) {
    const fn = this.createLambdaFunction(`${idPrefix}Function`, origin, {
      timeout: Duration.seconds(30),
      memorySize: idPrefix === 'ImageOptimizer' ? 1536 : 1024,
    });

    const fnUrl = fn.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      invokeMode: origin.streaming ? InvokeMode.RESPONSE_STREAM : InvokeMode.BUFFERED,
    });

    this.grantRuntimePermissions(fn);

    return new HttpOrigin(Fn.parseDomainName(fnUrl.url));
  }

  private createLambdaFunction(
    id: string,
    fn: BaseFunction,
    options: { timeout: Duration; memorySize: number },
  ) {
    return new LambdaFunction(this, id, {
      runtime: Runtime.NODEJS_20_X,
      architecture: Architecture.ARM_64,
      handler: fn.handler,
      code: Code.fromAsset(this.resolveAssetPath(fn.bundle)),
      environment: {
        ...this.appEnvironment,
        ...this.getOpenNextEnvironment(),
      },
      timeout: options.timeout,
      memorySize: options.memorySize,
    });
  }

  private getOpenNextEnvironment() {
    return {
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      CACHE_BUCKET_NAME: this.bucket.bucketName,
      CACHE_BUCKET_KEY_PREFIX: '_cache',
      CACHE_BUCKET_REGION: Stack.of(this).region,
      REVALIDATION_QUEUE_URL: this.queue.queueUrl,
      REVALIDATION_QUEUE_REGION: Stack.of(this).region,
      CACHE_DYNAMO_TABLE: this.table.tableName,
      BUCKET_NAME: this.bucket.bucketName,
      BUCKET_KEY_PREFIX: '_assets',
    };
  }

  private grantRuntimePermissions(grantable: IGrantable) {
    this.bucket.grantReadWrite(grantable);
    this.table.grantReadWriteData(grantable);
    this.queue.grantSendMessages(grantable);
  }

  private createDistribution(origins: Record<string, IOrigin>) {
    const defaultOrigin = origins.default;
    if (!defaultOrigin) {
      throw new Error('OpenNext output does not define the default origin.');
    }

    const forwardedHostFunction = new CloudFrontFunction(this, 'ForwardedHostFunction', {
      code: FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  request.headers["x-forwarded-host"] = request.headers.host;
  return request;
}
`),
    });

    const functionAssociations = [
      {
        function: forwardedHostFunction,
        eventType: FunctionEventType.VIEWER_REQUEST,
      },
    ];

    return new Distribution(this, 'OpenNextDistribution', {
      comment: 'Hello GSM client stage OpenNext distribution',
      defaultBehavior: this.createDynamicBehavior(defaultOrigin, functionAssociations),
      additionalBehaviors: this.openNextOutput.behaviors
        .filter((behavior) => behavior.pattern !== '*' && behavior.pattern !== '/*')
        .reduce<Record<string, BehaviorOptions>>((behaviors, behavior) => {
          const originName = behavior.origin ?? 'default';
          const origin = origins[originName] ?? defaultOrigin;
          const pattern = behavior.pattern.replace(/^\//, '');

          behaviors[pattern] =
            originName === 's3'
              ? this.createStaticBehavior(origin, functionAssociations)
              : this.createDynamicBehavior(origin, functionAssociations);

          return behaviors;
        }, {}),
    });
  }

  private createDynamicBehavior(
    origin: IOrigin,
    functionAssociations: BehaviorOptions['functionAssociations'],
  ): BehaviorOptions {
    return {
      origin,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: AllowedMethods.ALLOW_ALL,
      cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
      cachePolicy: this.serverCachePolicy,
      originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      functionAssociations,
    };
  }

  private createStaticBehavior(
    origin: IOrigin,
    functionAssociations: BehaviorOptions['functionAssociations'],
  ): BehaviorOptions {
    return {
      origin,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
      cachePolicy: this.staticCachePolicy,
      functionAssociations,
    };
  }

  private createServerCachePolicy() {
    return new CachePolicy(this, 'OpenNextServerCachePolicy', {
      queryStringBehavior: CacheQueryStringBehavior.all(),
      headerBehavior: CacheHeaderBehavior.allowList(
        'accept',
        'accept-encoding',
        'accept-language',
        'rsc',
        'next-router-prefetch',
        'next-router-state-tree',
        'next-url',
        'x-prerender-revalidate',
      ),
      cookieBehavior: CacheCookieBehavior.none(),
      defaultTtl: Duration.seconds(0),
      maxTtl: Duration.seconds(0),
      minTtl: Duration.seconds(0),
    });
  }

  private toConstructId(value: string) {
    const id = value.replace(/[^a-zA-Z0-9]/g, '');
    return id || 'Asset';
  }
}
