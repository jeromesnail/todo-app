const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// Todo.remove({})
//   .then(result => {
//     console.log(result);
//   });

// Todo.findByIdAndRemove('5ab2baa5ea725bd9ad9e9df2')
//   .then(todo => {
//     console.log(todo);
//   });

Todo.findOneAndRemove({
  text: 'something to do'
})
  .then(todo => {
    console.log(todo);
  });