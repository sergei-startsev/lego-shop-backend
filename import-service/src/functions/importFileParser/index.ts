import { handlerPath } from '@libs/handler-resolver';
import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;
if (!env) {
  throw Error('env is not specified');
}

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: env.BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: [{ prefix: 'uploaded/' }, { suffix: '.csv' }],
        existing: true,
        forceDeploy: true
      }
    }
  ]
};
