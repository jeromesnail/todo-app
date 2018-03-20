const { ObjectID } = require('mongodb');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
  }, {
    _id: new ObjectID,
    text: 'Secopns test todo'
  }
];

module.exports = { todos };