import Collection from './collection';

const collection = new Collection();

// collection.createConnection('test111');

// collection.getConnection('test111').then((msg) => {
//   msg.update({ data: { test: 222333 } }, { test: 111222 }).then((msg) => {
//     console.log(msg);
//   });
// });

collection.getConnection('test111').then((msg) => {
  msg
    .createCondition({
      where: { test: 333111 },
      limit: 10,
      order: 'desc',
    })
    .select()
    .then((msg) => {
      console.log(msg);
    });
});

export default Collection;
