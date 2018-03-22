const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const { todos } = require('./fixtures/todos');

const text = 'Test todo text';
const id1 = todos[0]._id.toHexString();
const id2 = todos[1]._id.toHexString();
const randomId = new ObjectID().toHexString();

beforeEach((done) => {
  Todo.remove({})
    .then(() => Todo.insertMany(todos))
    .then(() => done());
});


describe('POST /todos', () => {

  it('should create a new todo', done => {
    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  })
});


describe('GET /todos/:id', () => {
  it('should get one todo by id', done => {
    request(app)
      .get(`/todos/${id1}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  });

  it('should get status 404 if todo not found', done => {
    request(app)
      .get(`/todos/${randomId}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('ID not found');
      })
      .end(done);
  });

  it('should get status 404 if id is invalid', done => {
    request(app)
      .get('/todos/someInvalidID')
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid ID');
      })
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete a todo by his id', done => {
    request(app)
      .delete(`/todos/${id2}`)
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
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('ID not found');
      })
      .end(done);
  });

  it('should get status 404 if id is invalid', done => {
    request(app)
      .delete('/todos/someInvalidID')
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid ID');
      })
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', done => {
    request(app)
      .patch(`/todos/${id1}`)
      .send({ text, completed: true })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', done => {
    request(app)
      .patch(`/todos/${id2}`)
      .send({ text, completed: false })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });

  it('should get status 404 if todo not found', done => {
    request(app)
      .patch(`/todos/${randomId}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('ID not found');
      })
      .end(done);
  });

  it('should get status 404 if id is invalid', done => {
    request(app)
      .patch('/todos/someInvalidID')
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid ID');
      })
      .end(done);
  });
});