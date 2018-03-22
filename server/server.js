require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const port = process.env.PORT;

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const newTodo = new Todo({ text: req.body.text });
  newTodo.save()
    .then(todo => {
      res.send({ status: 200, todo });
    })
    .catch(e => {
      res.status(400).send({
        status: 400,
        error: 'Failed to add the todo'
      });
    });
});

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
    res.send({ status: 200, todos });
  }).catch(e => {
    res.status(400).send({
      status: 400,
      error: 'Failed to fetch todos'
    });
  });
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      status: 404,
      error: 'Invalid ID'
    });
  }
  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send({
          status: 404,
          error: 'ID not found'
        });
      }
      res.send({ status: 200, todo });
    }).catch(e => {
      res.status(400).send({
        status: 400,
        error: 'Request failed'
      });
    });
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      status: 404,
      error: 'Invalid ID'
    });
  }
  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send({
          status: 404,
          error: 'ID not found'
        });
      }
      res.send({ status: 200, todo });
    })
    .catch(e => {
      res.status(400).send({
        status: 400,
        error: 'Request failed'
      });
    });
});

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      status: 404,
      error: 'Invalid ID'
    });
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else if (body.hasOwnProperty('completed')) {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send({
          status: 404,
          error: 'ID not found'
        });
      }
      res.send({ status: 200, todo });
    }).catch(e => {
      res.status(400).send({
        status: 400,
        error: 'Request failed'
      });
    });
});

app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);
  user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header('x-auth', token).send({ status: 200, user })
    })
    .catch(e => {
      res.status(400).send({
        status: 400,
        error: 'Failed to add the user'
      });
    });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send({ status: 200, user: req.user });
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

module.exports = { app };