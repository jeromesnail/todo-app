const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user')

const { todos, users, text, id1, id2, randomId, populateTodos, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

  it('should create a new todo', done => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
      })
      .end((e, res) => {
        if (e) return done(e);
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(3);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should not create todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((e, res) => {
        if (e) return done(e)
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});


describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  })
});


describe('GET /todos/:id', () => {
  it('should get one todo by id', done => {
    request(app)
      .get(`/todos/${id1}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  });

  it('should get status 404 if todo not found', done => {
    request(app)
      .get(`/todos/${randomId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('ID not found');
      })
      .end(done);
  });

  it('should get status 404 if id is invalid', done => {
    request(app)
      .get('/todos/someInvalidID')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid ID');
      })
      .end(done);
  });

  it('should not return a todo created by another user', done => {
    request(app)
      .get(`/todos/${id2}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete a todo by his id', done => {
    request(app)
      .delete(`/todos/${id2}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end((e, res) => {
        if (e) return done(e);
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(1);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should get status 404 if todo not found', done => {
    request(app)
      .delete(`/todos/${randomId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('ID not found');
      })
      .end(done);
  });

  it('should get status 404 if id is invalid', done => {
    request(app)
      .delete('/todos/someInvalidID')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid ID');
      })
      .end(done);
  });

  it('should not delete a todo created by another user', done => {
    request(app)
      .delete(`/todos/${id1}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((e, res) => {
        if (e) return done(e);
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });  
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', done => {
    request(app)
      .patch(`/todos/${id1}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ text, completed: true })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', done => {
    request(app)
      .patch(`/todos/${id2}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({ text, completed: false })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });

  it('should get status 404 if todo not found', done => {
    request(app)
      .patch(`/todos/${randomId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('ID not found');
      })
      .end(done);
  });

  it('should get status 404 if id is invalid', done => {
    request(app)
      .patch('/todos/someInvalidID')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid ID');
      })
      .end(done);
  });

  it('should not update the todo if wrong creator', done => {
    request(app)
      .patch(`/todos/${id1}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({ text, completed: true })
      .expect(404)
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', done => {
    const token = users[0].tokens[0].token;
    request(app)
      .get('/users/me')
      .set('x-auth', token)
      .expect(200)
      .expect((res) => {
        expect(res.body.user._id).toBe(users[0]._id.toHexString());
        expect(res.body.user.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body.error).toBe('Authentification required!')
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', done => {
    const email = 'jerome@prout.lol';
    const password = 'lolilolprout';
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.user._id).toBeTruthy();
        expect(res.body.user.email).toBe(email);
      })
      .end((e) => {
        if (e) return done(e);
        User.findOne({ email })
          .then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          });
      });
  });

  it('should return validation errors if request invalid', done => {
    request(app)
      .post('/users')
      .send({ email: 'prout', password: 'lol' })
      .expect(400)
      .expect(res => {
        expect(res.body.error).toBe('Failed to add the user');
      })
      .end(e => {
        if (e) return done(e);
        User.find()
          .then(users => {
            expect(users.length).toBe(2);
            done();
          });
      });
  });

  it('should not create user if email in use', done => {
    const email = users[0].email;
    const password = 'lolilolprout';
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .expect(res => {
        expect(res.body.error).toBe('Failed to add the user');
      })
      .end(e => {
        if (e) return done(e);
        User.find()
          .then(users => {
            expect(users.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });

  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', done => {
    const { email, password } = users[1];
    request(app)
      .post('/users/login')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((e, res) => {
        if (e) return done(e);
        User.findById(users[1]._id)
          .then(user => {
            expect(user.toObject().tokens[1]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should reject invalid login', done => {
    const email = users[0].email;
    const password = 'lolilolprout';
    request(app)
      .post('/users/login')
      .send({ email, password })
      .expect(400)
      .expect(res => {
        expect(res.body.error).toBe('Failed to anthentificate');
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((e, res) => {
        if (e) return done(e);
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(e => done(e));
      });
  })
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', done => {
    const token = users[0].tokens[0].token;
    const email = users[0].email;
    request(app)
      .delete('/users/me/token')
      .set('x-auth', token)
      .expect(200)
      .expect(res => {
        expect(res.body.message).toBe('User correctly logged out');
      })
      .end((e, res) => {
        if (e) return done(e);
        User.findOne({ email })
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});