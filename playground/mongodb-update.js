// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) return console.error('Unable to connect to MongoDB server', err);

  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: ObjectID('5ab1166483cab88787239c83')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // })
  //   .then((result) => {
  //     console.log(result);
  //   });

  db.collection('Users').findOneAndUpdate({
    name: 'Andrew'
  }, {
    $set: {
      name: 'Jérôme'
    },
      $inc: {
      age: 1
     }
  }, {
    returnOriginal: false
  })
    .then((result) => {
      console.log(result);
    });

  // client.close();
});