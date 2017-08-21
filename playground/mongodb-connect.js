// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb') // <-- ES6 style

MongoClient.connect('mongodb://localhost:27017/todo', (err, db) => {
  if (err) {
    return console.log('ERROR: Unable to connect ot MONGODB server')
  }
  console.log('connected to MongoDB server', err)

  db.collection('Todos').insertOne({
    text: 'Eat lunch',
    completed: false
  }, (err, result) => {
    if (err){
      return console.log('Error: Unable to insert TODO', err)
    }

    console.log(JSON.stringify(result.ops, undefined, 2))

  })

// Insert new doc into Users (name, age, location)

  // db.collection('Users').insertOne({
  //   name: 'Antony',
  //   age: 29,
  //   location: 'Kyiv'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('ERROR: unable to insert USER', err)
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // })

  db.close()
})
