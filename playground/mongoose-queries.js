const {mongoose} = require('../server/db/mongoose')
const {Todo} = require('../server/models/todo')
const {User} = require('../server/models/user')

const id = '5991e85c3b7831275dab81bc'

const {ObjectID} = require('mongodb')
if (!ObjectID.isValid(id)) {
  console.log('ID is not valid')
}

// Todo.find({
//   _id : id
// }).then((todos) => {
//   console.log('Todos', JSON.stringify(todos, undefined, 2))
// })
//
// Todo.findOne({
//   _id : id
// }).then((todo) => {
//   if (!todo) { return console.log('id not found')}
//   console.log('findOne todo:', todo)
// })

Todo.findById(id)
  .then((todo) => {
    if (!todo) { return console.log('todo not found')}
    console.log('todo by id:', JSON.stringify(todo, undefined, 2))
  })
  .catch((err)=> {
    console.log(err)
  })

User.findById('59917923683c5010f0fb61a1')
  .then((user) => {
    if (!user) { return console.log('user not found')}
    console.log('user by id', JSON.stringify(user, undefined, 2))
  })
  .catch((err) => {
    console.log(err)
  })
