import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Handler } from 'aws-lambda';
import createError from 'http-errors';
import * as z from 'zod';
import pino from 'pino';
import { serializeResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product, Stock } from '@customTypes/api-types';

const getProductById: Handler = async event => {
  const logger = pino();
  logger.info('getProductById');
  logger.info(event);

  const schema = z.object({
    id: z.string().uuid()
  });
  const parsed = schema.safeParse(event?.pathParameters);
  if (!parsed.success) {
    throw createError(400, parsed.error);
  }
  const { id } = parsed.data;

  const client = new DynamoDBClient({ region: process.env.REGION });
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  const getProductById = new QueryCommand({
    TableName: process.env.PRODUCTS_TABLE_NAME,
    KeyConditionExpression: 'id=:id',
    ExpressionAttributeValues: { ':id': id }
  });
  const products = (await ddbDocClient.send(getProductById))?.Items as Omit<Product, 'count'>[];
  const product = products?.[0];
  if (!product) {
    throw createError(404, 'Product not found');
  }

  const getCountById = new QueryCommand({
    TableName: process.env.STOCK_TABLE_NAME,
    KeyConditionExpression: 'product_id=:id',
    ExpressionAttributeValues: { ':id': id }
  });
  const stocks = (await ddbDocClient.send(getCountById))?.Items as Stock[];
  const count = stocks?.[0].count;

  return serializeResponse({ ...product, count });
};

export const main = middyfy(getProductById);
