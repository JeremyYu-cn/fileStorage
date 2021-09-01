import Collection from '../collection';
import path from 'path';
import { IReadLineResult } from '@/utils/statusMsg';

const collect = new Collection({
  baseUrl: path.resolve(__dirname, '..', 'file_data'),
});

describe('test file storage collection', () => {
  // test('test create collection', async () => {
  //   const isCreateSuccess = await collect.createConnection(
  //     'test_createCollection'
  //   );
  //   expect(isCreateSuccess).toBeTruthy();
  // });

  test('test create collection fail', async () => {
    try {
      await collect.createConnection('test_createCollection');
    } catch (err) {
      expect(err.toString()).toEqual('Error: collection is exists');
    }
  });

  // test('test append data', async () => {
  //   const sock = await collect.getConnection('test_createCollection');
  //   const result = await sock.insert({ test: 111222 });

  //   expect(result).toMatchObject<IReadLineResult<[]>>({
  //     code: 200,
  //     msg: 'success',
  //     data: [],
  //     time: expect.stringMatching(/\d ms/),
  //     length: expect.any(Number),
  //   });
  // });

  // test('test update data', async () => {
  //   const sock = await collect.getConnection('test_createCollection');
  //   const result = await sock.update(
  //     {
  //       data: {
  //         test: 222333,
  //       },
  //     },
  //     {}
  //   );
  //   expect(result).toMatchObject<IReadLineResult<[]>>({
  //     code: 200,
  //     msg: expect.stringMatching(/\d records changed./),
  //     data: [],
  //     time: expect.stringMatching(/\d ms/),
  //     length: expect.any(Number),
  //   });
  // });

  test('select data', async () => {
    const sock = await collect.getConnection('test_createCollection');
    const result = await sock.select();

    expect(result).toMatchObject<IReadLineResult<[]>>({
      code: 200,
      msg: 'success',
      data: expect.any(Array),
      time: expect.stringMatching(/\d ms/),
      length: expect.any(Number),
    });
  });

  test('select data with limit', async () => {
    const sock = await collect.getConnection('test_createCollection');
    const result = await sock
      .createCondition({
        limit: 10,
      })
      .select();

    expect(result).toMatchObject<IReadLineResult<[]>>({
      code: 200,
      msg: 'success',
      data: expect.any(Array),
      time: expect.stringMatching(/\d ms/),
      length: 10,
    });
  });

  test('select data with limit and condition that return no content', async () => {
    const sock = await collect.getConnection('test_createCollection');
    const result = await sock
      .createCondition({
        where: { test: 'hello world' },
        limit: 10,
      })
      .select();

    expect(result).toMatchObject<IReadLineResult<[]>>({
      code: 200,
      msg: 'success',
      data: expect.any(Array),
      time: expect.stringMatching(/\d ms/),
      length: 0,
    });
  });

  test('select data with limit order by desc', async () => {
    const sock = await collect.getConnection('test_createCollection');
    const result = await sock
      .createCondition({
        order: 'desc',
        limit: 10,
      })
      .select();

    expect(result).toMatchObject<IReadLineResult<[]>>({
      code: 200,
      msg: 'success',
      data: expect.any(Array),
      time: expect.stringMatching(/\d ms/),
      length: 10,
    });
  });

  test('test use count methods', async () => {
    const sock = await collect.getConnection('test_createCollection');
    const result = await sock.count();

    expect(Number.isInteger(result)).toBeTruthy();
  });

  test('test use count methods with condition', async () => {
    const sock = await collect.getConnection('test_createCollection');
    const result = await sock
      .createCondition({
        where: {
          test: 111222,
        },
      })
      .count();

    expect(Number.isInteger(result)).toBeTruthy();
  });
});
