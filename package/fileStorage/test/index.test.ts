import Collection from '../collection';
import path from 'path';

const collect = new Collection({
  baseUrl: path.resolve(__dirname, '..', 'file_data'),
});

test('test create collection', async () => {
  const isCreateSuccess = await collect.createConnection(
    'test_createCollection'
  );
  expect(isCreateSuccess).toBeTruthy();
});

test('test create collection fail', async () => {
  try {
    await collect.createConnection('test_createCollection');
  } catch (err) {
    expect(err.toString()).toEqual('Error: collection is exists');
  }
});
