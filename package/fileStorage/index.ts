import Collection from './collection';

const collection = new Collection();

// collection.createConnection('test');

collection.getConnection('test').then((msg) => {
  msg.where({ test: 111 }).select();
});
