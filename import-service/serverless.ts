import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const env = dotenv.config().parsed;
if (!env) {
  throw Error('env is not specified');
}

const serverlessConfiguration: AWS = {
  service: 'lego-shop-backend-app-task-5',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-auto-swagger'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'eu-central-1',
    memorySize: 512,
    timeout: 10,
    httpApi: {
      cors: true
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 's3:*',
            Resource: [
              'arn:aws:s3:::${self:provider.environment.BUCKET_NAME}',
              'arn:aws:s3:::${self:provider.environment.BUCKET_NAME}/*'
            ]
          }
        ]
      }
    },
    environment: env
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  resources: {
    Resources: {
      LegoShopImportBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:provider.environment.BUCKET_NAME}',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT', 'POST'],
                AllowedOrigins: ['*'],
                ExposedHeaders: []
              }
            ]
          }
        }
      }
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    }
  }
};

module.exports = serverlessConfiguration;
