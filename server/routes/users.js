module.exports = (app) => {
  const _ = require('lodash');

  const { User } = require('../models/user');
  const { authenticate } = require('../middleware/authenticate');

  app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    user.save()
      .then(() => {
        return user.generateAuthToken();
      })
      .then(token => {
        res.header('x-auth', token).send({ status: 200, user });
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

  app.post('/users/login', (req, res) => {
    const { email, password } = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(email, password)
      .then(user => {
        return user.generateAuthToken()
          .then(token => {
            res.header('x-auth', token).send({ status: 200, user });
          });
      })
      .catch(e => {
        res.status(400).send({
          status: 400,
          error: 'Failed to anthentificate'
        });
      });
  });

  app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token)
      .then(() => {
        res.status(200).send({
          status: 200,
          message: 'User correctly logged out'
        });
      }).catch(e => {
        res.status(400).send({
          status: 400,
          error: 'Failed to log out'
        });
      });
  });

};