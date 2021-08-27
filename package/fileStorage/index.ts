import Collection from './collection';

const collection = new Collection();

// collection.createConnection('test111');

collection.getConnection('test111').then((msg) => {
  msg
    .where({ test: 222 })
    .select()
    .then((msg) => {
      console.log(msg);
    });
});

export default Collection;
