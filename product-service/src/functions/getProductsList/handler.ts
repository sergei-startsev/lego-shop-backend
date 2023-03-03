import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Handler } from 'aws-lambda';
import pino from 'pino';
import { serializeResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product, Stock } from '@customTypes/api-types';

const getProductsList: Handler = async event => {
  const logger = pino();
  logger.info('getProductsList');
  logger.info(event);

  const client = new DynamoDBClient({ region: process.env.REGION });
  const ddbDocClient = DynamoDBDocumentClient.from(client);
  const command = new ScanCommand({
    TableName: process.env.PRODUCTS_TABLE_NAME,
    Limit: 20
  });
  const products = (await ddbDocClient.send(command))?.Items as Omit<Product, 'count'>[];
  const join = await Promise.all(
    products?.map(async item => {
      const command = new QueryCommand({
        TableName: process.env.STOCK_TABLE_NAME,
        KeyConditionExpression: 'product_id=:id',
        ExpressionAttributeValues: { ':id': item.id }
      });
      const stocks = (await ddbDocClient.send(command))?.Items as Stock[];
      const count = stocks?.[0].count;
      return { ...item, count };
    })
  );
  return serializeResponse(join);
};

export const main = middyfy(getProductsList);
