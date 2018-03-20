const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// const id = '5ab15f19e0cb166192fe3a3c11';

// if (!ObjectID.isValid(id)) {
//   console.error('ID not valid');  
// }

// Todo.find({ _id: id })
//   .then((todos) => {
//     console.log('Todos', todos);
//   })
//   .catch((e) => {
//     console.error(e);
//   });

// Todo.findOne({ id; id })
//   .then((todo) => {
//     console.log('Todo', todo);
//   })
//   .catch((e) => {
//     console.error(e);
//   });

// Todo.findById(id)
//   .then((todo) => {
//     if (!todo) return console.error('Id not found');
//     console.log('Todo by id', todo);
//   })
//   .catch((e) => {
//     console.error(e);
//   });

const id = '5ab138bcb3bbce3e193b35a3';

User.findById(id)
  .then(user => {
    if (!user) return console.error('ID not found');
    console.log('User: ', user);        
  })
  .catch(e => {
    if (!ObjectID.isValid(id)) return console.error('ID is invalid!');
    console.error('Unknown error!', e);        
  });