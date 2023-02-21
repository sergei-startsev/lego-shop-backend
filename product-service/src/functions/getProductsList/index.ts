import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/products',
        responseData: {
          // response with description and response body
          200: {
            description: 'Products list',
            bodyType: 'ProductsList',
          }
        }
      }
    }
  ]
};
