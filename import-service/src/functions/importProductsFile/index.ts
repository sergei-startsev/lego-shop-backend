import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/import',
        queryStringParameters: {
          name: {
            required: true,
            type: 'string',
            description: 'File name'
          }
        },
        responseData: {
          // response with description and response body
          200: {
            description: 'Signed URL for uploading products file'
          },
          400: {
            description: 'Invalid request'
          }
        }
      }
    }
  ]
};
