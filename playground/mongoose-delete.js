const {mongoose} = require('../server/db/mongoose')
const {Todo} = require('../server/models/todo')
const {User} = require('../server/models/user')

const {ObjectID} = require('mongodb')


// Todo.remove({})

// Todo.findOneAndRemove

// Todo.findByIdAndRemove

Todo.remove({})
  .then((result) => {
    console.log(result)
    // tells only OK and number of removed items
  })

Todo.findOneAndRemove({_id: '...'})
  .then ((todo) => {

  })

Todo.findByIdAndRemove('asdfsadf')
  .then((todo) => {
    console.log(todo)
  })
