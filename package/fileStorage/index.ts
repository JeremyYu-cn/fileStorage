import Collection from './collection';

const collection = new Collection();

// collection.createConnection('test');

collection.getConnection('testwrite').then(async (msg) => {
  const result = await msg.where({ test1: 111, test2: 111 }).update({
    data: {
      test3: 111,
    },
  });
  console.log(result);
});
