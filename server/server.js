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
      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send({
        error: 'Failed to add the todo'
      });
    });
});

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
    res.send({ todos });
  }).catch(e => {
    res.status(400).send(e)
  });
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      error: 'Invalid ID'
    });
  }
  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send({
          error: 'ID not found'
        });
      }
      res.send({ todo });
    }).catch(e => {
      res.status(400).send({
        error: 'Request failed'
      });
    });
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      error: 'Invalid ID'
    });
  }
  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send({
          error: 'ID not found'
        });
      }
      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send({
        error: 'Request failed'
      });
    });
});

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
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
          error: 'ID not found'
        });
      }
      res.send({ todo });
    }).catch(e => {
      res.status(400).send({
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
      res.header('x-auth', token).send({ user })
    })
    .catch(e => {
      res.status(400).send({
        error: 'Failed to add the user',
        description: e
      });
    });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send({ user: req.user });
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

module.exports = { app };