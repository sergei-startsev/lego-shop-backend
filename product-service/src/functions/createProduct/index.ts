import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'post',
        path: '/products',
        bodyType: 'ProductPostBody',
        responseData: {
          // response with description and response body
          200: {
            description: 'Product created',
            bodyType: 'Product'
          },
          400: {
            description: 'Invalid request'
          },
          500: 'Internal Server Error'
        }
      }
    }
  ]
};
