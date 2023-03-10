import { Context } from 'aws-lambda';
import { main } from './handler';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: () => Promise.resolve('https://test-url.com')
}));

describe('importProductsFile', () => {
  const event = {
    version: '2.0',
    routeKey: 'GET /import',
    rawPath: '/import',
    rawQueryString: 'name=bar.csv',
    headers: {
      accept: '*/*',
      'accept-encoding': 'gzip, deflate, br'
    },
    queryStringParameters: {
      name: 'bar.csv'
    },
    requestContext: {},
    isBase64Encoded: false
  };

  beforeEach(() => {
    process.env.BUCKET_NAME = 'test_bucket_name';
  });

  afterEach(() => {
    process.env.BUCKET_NAME = undefined;
  });

  it('should return the signed url', async () => {
    const res = await main(event, {} as Context, () => {});
    expect(res).toMatchSnapshot();
  });

  it('should return 400 status code if name param is not provided', async () => {
    const newEvent = { ...event, queryStringParameters: {} };
    const res = await main(newEvent, {} as Context, () => {});
    expect(res).toMatchSnapshot();
  });

  it('should return 400 status code if name param does not match the schema', async () => {
    const newEvent = { ...event, queryStringParameters: { name: '1' } };
    const res = await main(newEvent, {} as Context, () => {});
    expect(res).toMatchSnapshot();
  });
});
