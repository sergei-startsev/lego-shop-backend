import { Context } from 'aws-lambda';
import { main } from './handler';

describe('getProductsList', () => {
  it('should return products list', async () => {
    const res = await main(null, {} as Context, () => {});
    expect(res).toMatchSnapshot();
  });
});
