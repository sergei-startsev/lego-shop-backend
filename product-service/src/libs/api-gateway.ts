import type { APIGatewayProxyResultV2, Handler } from 'aws-lambda';
import type { JsonValue } from '@customTypes/json-value';

export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<S, APIGatewayProxyResultV2>;

export const formatJSONResponse = (response: JsonValue, statusCode = 200) => {
  return {
    statusCode,
    body: JSON.stringify(response)
  };
};
