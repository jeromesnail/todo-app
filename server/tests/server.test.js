const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const { todos } = require('./fixtures/todos');


beforeEach((done) => {
  Todo.remove({})
    .then(() => Todo.insertMany(todos))
    .then(() => done());
});


describe('POST /todos', () => {

  it('should create a new todo', done => {
    const text = 'Test todo text';
    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((e, res) => {
        if (e) return done(e);
        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
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
    const id = todos[0]._id.toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  });

  it('should get status 404 if todo not found', done => {
    const id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
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
    const id = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
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
    const id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
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