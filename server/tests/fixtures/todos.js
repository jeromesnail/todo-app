const { ObjectID } = require('mongodb');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
  }, {
    _id: new ObjectID,
    text: 'Second test todo',
    completed: true,
    completedAt: 1521713807287
  }
];

module.exports = { todos };