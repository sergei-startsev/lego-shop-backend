import { Context } from 'aws-lambda';
import { main } from './handler';

const buildEvent = (id: string) => ({
  version: '2.0',
  routeKey: 'GET /products/{id}',
  rawPath: `/products/${id}`,
  rawQueryString: '',
  headers: {
    accept: 'text/html',
    'accept-encoding': 'gzip, deflate, br'
  },
  requestContext: {
    accountId: '1',
    apiId: '1',
    domainName: 'foo.execute-api.eu-central-1.amazonaws.com',
    domainPrefix: 'foo',
    http: {
      method: 'GET',
      path: `/products/${id}`,
      protocol: 'HTTP/1.1',
      sourceIp: '127.0.0.1',
      userAgent: 'Chrome/110.0.0.0'
    },
    requestId: '111',
    routeKey: 'GET /products/{id}',
    stage: '$default',
    time: '20/Feb/2023:23:46:42 +0000',
    timeEpoch: 1676936802838
  },
  pathParameters: { id },
  isBase64Encoded: false
});

describe('getProductById', () => {
  it('should return product by id', async () => {
    const event = buildEvent('42133');
    const res = await main(event, {} as Context, () => {});
    expect(res).toMatchSnapshot();
  });

  it('should return 404 status code', async () => {
    const event = buildEvent('11111');
    const res = await main(event, {} as Context, () => {});
    expect(res).toMatchSnapshot();
  });

  it('should return 500 status code', async () => {
    const event = buildEvent('');
    const res = await main(event, {} as Context, () => {});
    expect(res).toMatchSnapshot();
  });
});
