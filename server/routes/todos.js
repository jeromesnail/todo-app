module.exports = (app) => {
  const _ = require('lodash');
  const { ObjectID } = require('mongodb');

  const { Todo } = require('../models/todo');
  const { authenticate } = require('../middleware/authenticate');

  app.post('/todos', authenticate, async (req, res) => {
    try {
      const newTodo = new Todo({
        text: req.body.text,
        _creator: req.user._id
      });
      const todo = await newTodo.save();
      res.send({ status: 200, todo });
    } catch (e) {
      res.status(400).send({
        status: 400,
        error: 'Failed to add the todo'
      });
    }
  });

  app.get('/todos', authenticate, async (req, res) => {
    try {
      const todos = await Todo.find({ _creator: req.user._id });
      res.send({ status: 200, todos });
    } catch (e) {
      res.status(400).send({
        status: 400,
        error: 'Failed to fetch todos'
      });
    }
  });

  app.get('/todos/:id', authenticate, async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectID.isValid(id)) {
        return res.status(404).send({
          status: 404,
          error: 'Invalid ID'
        });
      }
      const todo = await Todo.findOne({ _id: id, _creator: req.user._id });
      if (!todo) {
        return res.status(404).send({
          status: 404,
          error: 'ID not found'
        });
      }
      res.send({ status: 200, todo });
    } catch (e) {
      res.status(400).send({
        status: 400,
        error: 'Request failed'
      });
    }
  });

  app.delete('/todos/:id', authenticate, async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectID.isValid(id)) {
        return res.status(404).send({
          status: 404,
          error: 'Invalid ID'
        });
      }
      const todo = await Todo.findOneAndRemove({ _id: id, _creator: req.user._id });
      if (!todo) {
        return res.status(404).send({
          status: 404,
          error: 'ID not found'
        });
      }
      res.send({ status: 200, todo });
    } catch (e) {
      res.status(400).send({
        status: 400,
        error: 'Request failed'
      });
    }    
  });

  app.patch('/todos/:id', authenticate, async (req, res) => {
    try {
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
      const todo = await Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
      }, {
          $set: body
        }, {
          new: true,
          runValidators: true
        });
        if (!todo) {
          return res.status(404).send({
            status: 404,
            error: 'ID not found'
          });
        }
        res.send({ status: 200, todo });
    } catch (e) {
      res.status(400).send({
        status: 400,
        error: 'Request failed'
      });
    }
  });
}