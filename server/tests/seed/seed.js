const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID,
  text: 'Second test todo',
  completed: true,
  completedAt: 1521713807287
}];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'userOne@todos.com',
  password: 'userOnePwd',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'userTwo@todos.com',
  password: 'userTwoPwd'
}];

const populateTodos = done => {
  Todo.remove({})
    .then(() => Todo.insertMany(todos))
    .then(() => done());
}

const populateUsers = done => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();
      return Promise.all([userOne, userTwo]);  
    })
    .then(() => done());
}

const text = 'Test todo text';
const id1 = todos[0]._id.toHexString();
const id2 = todos[1]._id.toHexString();
const randomId = new ObjectID().toHexString();


module.exports = { todos, users, text, id1, id2, randomId, populateTodos, populateUsers };