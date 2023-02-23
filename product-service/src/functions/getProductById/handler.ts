import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import mockData from '@mocks/data.json';

export type ValidatedAPIGatewayProxyEvent = Omit<APIGatewayProxyEventV2, 'pathParameters'> & {
  pathParameters: {
    id: string;
  };
};

const getProductById: ValidatedEventAPIGatewayProxyEvent<ValidatedAPIGatewayProxyEvent> = async event => {
  const id = event?.pathParameters?.id;
  if (!id) {
    return formatJSONResponse('Product ID not specified', 500);
  }
  const product = mockData.find(obj => obj.id === id);
  if (product) {
    return formatJSONResponse(product);
  } else {
    return formatJSONResponse('Product not found', 404);
  }
};

export const main = getProductById;
