// dependencies:
const express = require('express'),
  bodyParser = require('body-parser'),
  {ObjectID} = require('mongodb'),
  _ = require('lodash'),
  jwt = require('jsonwebtoken'),
// modules:
  {mongoose} = require('./db/mongoose'),
// Models:
  {Todo} = require('./models/todo'),
  {User} = require('./models/user'),
//middleware
  {authenticate} = require('./middleware/authenticate')

require('dotenv').config()
const {PORT, NODE_ENV} = process.env

const app = express()


// middleware:
app.use(bodyParser.json())

// ROUTES: -----------------------------------------------
app.get('/', (req, res) => {
  res.send('I\'m ROOT')
})

//index
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  })
    .then((todos) => {
      res.send({
        todos,
        code: 'custom status code'
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(400).send('Error')
    })
})

// new
app.get('/todo/new', (req, res) => {
  res.send('NEW RESTful route')
})

//create
app.post('/todos', authenticate, (req, res) => {
  const {text} = req.body
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })
  todo.save()
    .then((doc) => {
      res.status(200).send(doc)
    })
    .catch((err) => {
      console.log(err)
      res.status(400).send()
    })
})

//show
app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Bad request')
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send('Not found')
      }
      res.status(200).send({todo})
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send()
    })
})

// edit
app.get('/todos/:id/edit', (req, res) => {
  res.send('EDIT RESTful route')
})


// update
app.patch('/todos/:id', authenticate, (req, res)=>{
  const id = req.params.id
  const body = _.pick(req.body, ['text', 'completed'])

  if (!ObjectID.isValid(id)) {
    return res.status(400).send()
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findOneAndUpdate(
    {_id: id, _creator: req.user._id},
    {$set: body},
    {new: true}
  )
    .then((todo) => {
      if (!todo) {
        return res.status(404).send()
      }
      res.status(200).send({todo})
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send()
    })
})

// destroy
app.delete('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id
  if(!ObjectID.isValid(id)) {
    return res.status(400).send('Bad request')
  }
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
    .then((todo) => {
      if(!todo) {
        return res.status(404).send('Not found')
      }
      res.status(200).send({todo})
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send()
    })
})

// users routes ------------------------------------------------------
//create
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']),
    user = new User(body)


  user.save()
    .then(() => {
      return user.generateAuthToken()
    })
    .then((token) => {
      res.header('x-auth', token).send(user)
    })
    .catch((err) => {
      console.log(err)
      res.status(400).send()
    })
})


//
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

//POST /users/login {email, password}
app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password'])
  User.findByCredentials(body.email, body.password)
    .then((user) => {
       return user.generateAuthToken()
         .then((token) => {
           res.header('x-auth', token).send(user)
         })
    })
    .catch((err) => {
      console.log(err)
      res.status(400).send()
    })
})

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(()=> {
      res.status(200).send()
    })
    .catch((err) => {
      console.log(err)
      res.status(400).send()
    })
})

app.listen(PORT, () => {
  console.log(`Todo app: started on port ${PORT} in ${NODE_ENV} mode`)
})

module.exports = {app}
