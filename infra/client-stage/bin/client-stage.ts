#!/usr/bin/env node
import { App } from 'aws-cdk-lib';

import { ClientStageOpenNextStack } from '../lib/client-stage-open-next-stack';

const app = new App();

const stageName = app.node.tryGetContext('environment') ?? 'stage';
const appPath = app.node.tryGetContext('appPath') ?? '../../apps/client';
const openNextPath = app.node.tryGetContext('openNextPath') ?? '../../apps/client/.open-next';

new ClientStageOpenNextStack(app, 'HelloGsmClientStageOpenNextStack', {
  stackName: 'hello-gsm-client-stage-opennext',
  stageName,
  appPath,
  openNextPath,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? process.env.AWS_REGION ?? 'ap-northeast-2',
  },
});
