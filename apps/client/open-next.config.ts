import type { OpenNextConfig } from '@opennextjs/aws/types/open-next.js';

const config = {
  default: {
    override: {
      wrapper: 'aws-lambda-streaming',
      converter: 'aws-apigw-v2',
      incrementalCache: 's3-lite',
      tagCache: 'dynamodb-lite',
      queue: 'sqs-lite',
      proxyExternalRequest: 'node',
    },
    minify: true,
  },
  imageOptimization: {
    loader: 's3-lite',
    install: {
      packages: ['sharp@0.32.6'],
      arch: 'arm64',
      nodeVersion: '20',
      libc: 'glibc',
    },
  },
  revalidate: {},
  buildCommand: 'pnpm --filter @repo/ui build:styles && pnpm --filter client build',
  buildOutputPath: '.',
  appPath: '.',
  packageJsonPath: '../../package.json',
} satisfies OpenNextConfig;

export default config;
