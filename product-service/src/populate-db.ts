import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import * as dotenv from 'dotenv';
import * as products from './products.json';
import * as stock from './stock.json';

dotenv.config();

(async () => {
  const client = new DynamoDBClient({ region: process.env.REGION });
  const ddbDocClient = DynamoDBDocumentClient.from(client);
  try {
    const productsOutput = await Promise.all(
      products.map(item => {
        const command = new PutCommand({ TableName: process.env.PRODUCTS_TABLE_NAME, Item: item });
        return ddbDocClient.send(command);
      })
    );
    console.log(productsOutput);

    const stockOutput = await Promise.all(
      stock.map(item => {
        const command = new PutCommand({ TableName: process.env.STOCK_TABLE_NAME, Item: item });
        return ddbDocClient.send(command);
      })
    );
    console.log(stockOutput);
  } catch (err) {
    console.error(err);
  }
})();
