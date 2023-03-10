import { Handler } from 'aws-lambda';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import createError from 'http-errors';
import * as z from 'zod';
import pino from 'pino';
import { serializeResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const importProductsFile: Handler = async event => {
  const logger = pino();
  logger.info('importProductsFile');
  logger.info(event);

  const schema = z.object({
    name: z.string().min(3)
  });
  const parsed = schema.safeParse(event?.queryStringParameters);
  if (!parsed.success) {
    throw createError(400, parsed.error);
  }
  const { name } = parsed.data;

  const client = new S3Client({ region: process.env.REGION });
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `uploaded/${name}`
  });
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });

  return serializeResponse({ url });
};

export const main = middyfy(importProductsFile);
