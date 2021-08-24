import Collection from './collection';

const collection = new Collection();

// collection.createConnection('test');

collection.getConnection('test').then(async (msg) => {
  const result = await msg.update({ data: {} }, {});
  console.log(result);
});

export default Collection;
