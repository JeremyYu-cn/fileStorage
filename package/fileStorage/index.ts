import Collection from './collection';

const collection = new Collection();

// collection.createConnection('test111');

collection.getConnection('test111').then((msg) => {
  msg.update({ data: { test: 222333 } }, {});
});

export default Collection;
