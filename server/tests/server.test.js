const expect = require('expect')
const request = require('supertest')

const {app} = require('../server')
const {Todo} = require('../models/todo')
const {User} = require('../models/user')
const {ObjectID} = require('mongodb')

const {todos, populateTodos, users, populateUsers} = require('./seed')


beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text'

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text)
      })
      .end((err, res)=>{
        if (err) {
          return done(err)
        }

        Todo.find()
          .then((todos) => {
            expect(todos.length).toBe(3)
            expect(todos[2].text).toBe(text)
            done()
          })
          .catch(err => done(err))
      })
  })
  it('should not create todo with invalid body data', (done) =>{
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) { return done(err) }

        Todo.find()
          .then((todos) => {
            expect(todos.length).toBe(2)
            done()
          })
          .catch(err => done(err))
      })
  })
})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', (done)=> {
    request(app)
     .get(`/todos/${todos[0]._id.toHexString()}`)
     .set('x-auth', users[0].tokens[0].token)
     .expect(200)
     .expect((res) => {
       expect(res.body.todo.text).toBe(todos[0].text)
     })
     .end(done)
  })
  it('should return 404 if todo not found', (done) => {
    const id = new ObjectID
    request(app)
      .get(`/todos/${id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })
  it('should return 400 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done)
  })
  it('should not return todo doc created by another user', (done)=> {
    request(app)
     .get(`/todos/${todos[1]._id.toHexString()}`)
     .set('x-auth', users[0].tokens[0].token)
     .expect(404)
     .end(done)
  })
})

describe('PATCH /todos/:id', ()=> {
  it('should update todo', (done) => {
    // grab id of first item
    const hexId = todos[0]._id.toHexString()
    const newText = 'updated text for todo'
    //update text, set completed True
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text: newText
      })
    //200
      .expect(200)
      .expect((res) => {
    // res.body has .text , changed;
        expect(res.body.todo.text).toBe(newText)
    // completed is True
        expect(res.body.todo.completed).toBe(true)
    //completedAt is a number .toBeA(Number)
        expect(res.body.todo.completedAt).toBeA('number')
      })
      .end(done)
  })
  it('should not update todo created by another user', (done) => {
    const hexId = todos[0]._id.toHexString()
    const newText = 'updated text for todo'
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: true,
        text: newText
      })
      .expect(404)
      .end(done)
  })
  it('should clear completedAt when it\'s not completed', (done) => {
    // grab id of second todo item
    const hexId = todos[1]._id.toHexString()
    const newText = 'updated text for todo'
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: false,
        text: newText
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(newText)
        expect(res.body.todo.completed).toBe(false)
    //text is changed, completed false, completedAt is null .toNotExist()
        expect(res.body.todo.completedAt).toNotExist()
      })
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let hexId = todos[1]._id.toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res)=> {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.findById(hexId)
          .then((todo) => {
            expect(todo).toNotExist()
            done()
          })
          .catch(err => done(err))
      })
  })
  it('shoud return 404 if todo not found', (done) => {
    const id = new ObjectID
    request(app)
      .delete(`/todos/${id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done)
  })
  it('shoud return 400 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .set('x-auth', users[1].tokens[0].token)
      .expect(400)
      .end(done)
  })
  it('should not remove a todo of another user', (done) => {
    let hexId = todos[0]._id.toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.findById(hexId)
          .then((todo) => {
            expect(todo).toExist()
            done()
          })
          .catch(err => done(err))
      })
  })
})

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })
  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({})
      })
      .end(done)
  })
  it('should return 401 if token is wrong', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', 'some bullshit')
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('POST /users', ()=>{
  it('should create a user', (done) =>{
    const email = 'example@example.com'
    const password = '123asdf3'
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist()
        expect(res.body._id).toExist()
        expect(res.body.email).toBe(email)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }
        User.findOne({email})
          .then((user) => {
            expect(user).toExist()
            expect(user.password).toNotBe(password)
            done()
          })
          .catch((err) => done(err))
      })
  })
  it('should return validation error if invalid email', (done) =>{
    request(app)
      .post('/users')
      .send({email: '', password: '2342123'})
      .expect(400)
      .expect((res)=>{
        expect(res.body).toEqual({})
      })
      .end(done)
  })
  it('should return validation error if invalid password', (done) =>{
    request(app)
      .post('/users')
      .send({email: 'asdf@asdf.co', password: '123'})
      .expect(400)
      .expect((res)=>{
        expect(res.body).toEqual({})
      })
      .end(done)
  })
  it('should not create user if email in use', (done) =>{
    request(app)
      .post('/users')
      .send({email: users[0].email, password: '323423123'})
      .expect(400)
      .expect((res)=>{
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('POST /users/login', ()=> {
  it('should login user and return auth token', (done) =>{
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist()
      })
      .end((err, res)=> {
        if (err) {
          return done(err)
        }
        User.findById(users[1]._id)
          .then((user) => {
            expect(user.tokens[1]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            })
            done()
          })
          .catch((err) => done(err))
      })
  })
  it('should reject invalid password', (done) =>{
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'somebullshit-wrongpassword'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist()
      })
      .end((err, res)=> {
        if (err) {
          return done(err)
        }
        User.findById(users[1]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(1)
            done()
          })
          .catch((err) => done(err))
      })
  })
  it('should reject invalid email', (done) =>{
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email + 'some',
        password: users[1].password
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist()
      })
      .end((err, res)=> {
        if (err) {
          return done(err)
        }
        User.findById(users[1]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(1)
            done()
          })
          .catch((err) => done(err))
      })
  })
})

describe('DELETE /users/me/token', ()=>{
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist()
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        User.findById(users[0]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0)
            done()
          })
          .catch((err) => done(err))
      })
  })
})
