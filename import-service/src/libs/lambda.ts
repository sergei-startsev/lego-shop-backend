import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { Handler } from 'aws-lambda';

export const middyfy = (handler: Handler) => {
  return middy(handler).use(httpJsonBodyParser()).use(httpErrorHandler());
};
