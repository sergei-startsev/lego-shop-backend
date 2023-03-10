import { Handler, S3EventRecord } from 'aws-lambda';
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import csv from 'csv-parser';
import { Readable } from 'stream';
import pino from 'pino';

const importFileParser: Handler = async event => {
  const logger = pino();
  logger.info('importFileParser');
  logger.info(event);

  const record = event?.Records?.find((r: S3EventRecord) => r.eventName === 'ObjectCreated:Put');
  if (!record) {
    return event;
  }

  const bucket = record.s3.bucket.name;
  const key = record.s3.object.key;

  logger.info({ bucket });
  logger.info({ key });

  const client = new S3Client({ region: process.env.REGION });
  const getCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  });

  const response = await client.send(getCommand);
  if (!response?.Body) {
    return event;
  }

  await new Promise<void>((resolve, reject) => {
    (response.Body as Readable)
      .pipe(csv({ strict: true }))
      .on('data', data => {
        logger.info(data);
      })
      .on('error', reject)
      .on('end', () => {
        logger.info('importFileParser finished');
        resolve();
      });
  });

  const newKey = key.replace(/^uploaded/, 'parsed');
  const copyCommand = new CopyObjectCommand({
    CopySource: `${bucket}/${key}`,
    Bucket: bucket,
    Key: newKey
  });
  await client.send(copyCommand);
  logger.info(`${key} -> ${newKey}`);

  const deleteCommand = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key
  });
  await client.send(deleteCommand);
  logger.info(`${key} was deleted`);

  return event;
};

export const main = importFileParser;
