  // const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb') // <-- ES6 style

MongoClient.connect('mongodb://localhost:27017/todo', (err, db) => {
  if (err) {
    return console.log('ERROR: Unable to connect ot MONGODB server', err)
  }
  console.log('connected to MongoDB server')

  //deleteMany
  // db.collection('Todos')
  //   .deleteMany({text: 'Eat lunch'})
  //   .then((result) => {
  //     console.log(result)
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })

  //deleteOne
  // db.collection('Todos')
  //   .deleteOne({text: 'Eat lunch'})
  //   .then((result) => {
  //     console.log(result.result)
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })

  //findOneAndDelete
  db.collection('Users')

    .findOneAndDelete({_id: new ObjectID('598f3d37ab93c5bc17272e38')})
    .then((result) => {
      console.log(result)
    })
    .catch((err) => {
      console.log(err)
    })

  db.close()
})
