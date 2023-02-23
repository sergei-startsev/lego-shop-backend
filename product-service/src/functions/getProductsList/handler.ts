import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import mockData from '@mocks/data.json';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<void> = async () => formatJSONResponse(mockData);

export const main = getProductsList;
