// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) return console.error('Unable to connect to MongoDB server', err);

  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // db.collection('Todos').find({
  //   _id: new ObjectID('5ab03b7c23389614cca918ef')
  // }).toArray()
  //   .then((docs) => {
  //     console.log('Todos');
  //     console.log(JSON.stringify(docs, undefined, 2));
  //   })
  //   .catch((err) => {
  //     console.error('Unable to fetch data', err);
  //   });

  // db.collection('Users').find({ name:'Jérôme'}).count()
  //   .then((count) => {
  //     console.log('Todos count: ' + count);      
  //   })
  //   .catch((err) => {
  //     console.error('Unable to fetch data', err);
  //   });

  db.collection('Users').find({ name: 'Jérôme'}).toArray()
    .then((docs) => {
      console.log(JSON.stringify(docs, undefined, 2));      
    });

  // client.close();
});