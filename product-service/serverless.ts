import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';

const env = dotenv.config().parsed;
if (!env) {
  throw Error('env is not specified');
}

const serverlessConfiguration: AWS = {
  service: 'lego-shop-backend-app-task-4',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-auto-swagger'],
  provider: {
    name: 'aws',
    deploymentMethod: 'direct',
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
            Action: 'dynamodb:*',
            Resource: [
              'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.PRODUCTS_TABLE_NAME}',
              'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.STOCK_TABLE_NAME}'
            ]
          }
        ]
      }
    },
    environment: env
  },
  functions: { getProductsList, getProductById, createProduct },
  resources: {
    Resources: {
      LegoShopProductsDB: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: env.PRODUCTS_TABLE_NAME,
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
            { AttributeName: 'title', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' },
            { AttributeName: 'title', KeyType: 'RANGE' }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      },
      LegoShopStockDB: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: env.STOCK_TABLE_NAME,
          AttributeDefinitions: [{ AttributeName: 'product_id', AttributeType: 'S' }],
          KeySchema: [{ AttributeName: 'product_id', KeyType: 'HASH' }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
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
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    }
  }
};

module.exports = serverlessConfiguration;
