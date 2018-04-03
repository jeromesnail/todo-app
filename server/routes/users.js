module.exports = (app) => {
  const _ = require('lodash');

  const { User } = require('../models/user');
  const { authenticate } = require('../middleware/authenticate');

  app.post('/users', async (req, res) => {
    try {
      const body = _.pick(req.body, ['email', 'password']);
      const user = new User(body);
      await user.save();
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send({ status: 200, user });
    } catch (e) {
      res.status(400).send({
        status: 400,
        error: 'Failed to add the user'
      });
    }
  });

  app.get('/users/me', authenticate, (req, res) => {
    res.send({ status: 200, user: req.user });
  });

  app.post('/users/login', async (req, res) => {
    try {
      const { email, password } = _.pick(req.body, ['email', 'password']);
      const user = await User.findByCredentials(email, password);
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send({ status: 200, user });
    } catch (e) {
      res.status(400).send({
        status: 400,
        error: 'Failed to anthentificate'
      });
    }
  });

  app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
      await req.user.removeToken(req.token);
      res.status(200).send({
        status: 200,
        message: 'User correctly logged out'
      });
    } catch (e) {
      res.status(400).send({
        status: 400,
        error: 'Failed to log out'
      });
    }
  });

};