module.exports = (app) => {
  const _ = require('lodash');
  const { ObjectID } = require('mongodb');

  const { Todo } = require('../models/todo');
  const { authenticate } = require('../middleware/authenticate');

  app.post('/todos', authenticate, (req, res) => {
    const newTodo = new Todo({
      text: req.body.text,
      _creator: req.user._id
    });
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

  app.get('/todos', authenticate, (req, res) => {
    Todo.find({ _creator: req.user._id }).then(todos => {
      res.send({ status: 200, todos });
    }).catch(e => {
      res.status(400).send({
        status: 400,
        error: 'Failed to fetch todos'
      });
    });
  });

  app.get('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send({
        status: 404,
        error: 'Invalid ID'
      });
    }
    Todo.findOne({
      _id: id,
      _creator:req.user._id
    })
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

  app.delete('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send({
        status: 404,
        error: 'Invalid ID'
      });
    }
    Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    })
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

  app.patch('/todos/:id', authenticate, (req, res) => {
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
    Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user._id
    }, {
      $set: body
    }, {
      new: true,
      runValidators: true
    })
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
}