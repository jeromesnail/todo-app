// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) return console.error('Unable to connect to MongoDB server', err);

  console.log('Connected to MongoDB server');

  // db.collection('Todos').deleteMany({ text: 'Eat lunch' })
  //   .then((result) => {
  //     console.log(result);  
  //   });

  // db.collection('Todos').deleteOne({ text: 'Eat lunch' })
  // .then((result) => {
  //   console.log(result);  
  // });

  // db.collection('Todos').findOneAndDelete({ completed: false })
  //   .then((result) => {
  //     console.log(result);  
  //   });

  // db.collection('Users').deleteMany({ name: 'Jérôme' })
  //   .then(({ deletedCount }) => {
  //     console.log(`${deletedCount} removed`);      
  //   });

  db.collection('Users').findOneAndDelete({ _id: ObjectID("5ab11c0283cab88787239c85") })
    .then(({ value: { name } }) => {
      console.log(`"${name}" has been removed!`);      
    })

  // db.close();
});