import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { Handler } from 'aws-lambda';
import createError from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';
import pino from 'pino';
import { serializeResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product, Stock } from '@customTypes/api-types';

const createProduct: Handler = async event => {
  const logger = pino();
  logger.info('createProduct');
  logger.info(event);

  const schema = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number().positive(),
    count: z.number().nonnegative()
  });

  const parsed = schema.safeParse(event.body);
  if (!parsed.success) {
    throw createError(400, parsed.error);
  }

  const { title, description, price, count } = parsed.data;
  const id = uuidv4();
  const product: Omit<Product, 'count'> = { id, title, description, price };
  const stock: Stock = { product_id: id, count };

  const client = new DynamoDBClient({ region: process.env.REGION });
  const ddbDocClient = DynamoDBDocumentClient.from(client);
  const createProduct = new TransactWriteCommand({
    TransactItems: [
      {
        Put: {
          TableName: process.env.PRODUCTS_TABLE_NAME,
          Item: product
        }
      },
      {
        Put: {
          TableName: process.env.STOCK_TABLE_NAME,
          Item: stock
        }
      }
    ]
  });
  await ddbDocClient.send(createProduct);

  const output: Product = { id, title, description, price, count };
  return serializeResponse(output);
};

export const main = middyfy(createProduct);
