import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/products/{id}',
        responseData: {
          // response with description and response body
          200: {
            description: 'Product object',
            bodyType: 'Product',
          },
          404: {
            description: 'Product not found',
          },
          500: 'Product ID not specified',
        }
      }
    }
  ]
};
