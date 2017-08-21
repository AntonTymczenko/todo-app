  // const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb') // <-- ES6 style

MongoClient.connect('mongodb://localhost:27017/todo', (err, db) => {
  if (err) {
    return console.log('ERROR: Unable to connect ot MONGODB server', err)
  }
  console.log('connected to MongoDB server')

  db.collection('Todos')
    .find({completed: false}) // query
    // .find({_id: new ObjectID('598eba54e1431d11b60d498c')}) // by ID
    .toArray()
    .then((docs) => {
      console.log('Todos')
      console.log(JSON.stringify(docs, undefined, 2))
    })
    .catch((err) => {console.log('unable to fetch todos', err)})

  db.collection('Todos')
    .find({completed: false})
    .count()
    .then((count) => {
      console.log(`Todos count: ${count}`)
    })
    .catch((err) => {console.log(err)})

  db.collection('Users')
    .find({name: 'Antony'})
    .toArray()
    .then((docs) => {
      docs.forEach((item) => {
        console.log(`item: ${JSON.stringify(item, undefined, 2)}`)
      })
    })
    .catch((err) => {console.log(err)})

  db.close()
})
