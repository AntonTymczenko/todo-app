  // const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb') // <-- ES6 style

MongoClient.connect('mongodb://localhost:27017/todo', (err, db) => {
  if (err) {
    return console.log('ERROR: Unable to connect ot MONGODB server', err)
  }
  console.log('connected to MongoDB server')

  // findOneAndUpdate

  db.collection('Todos')
    .findOneAndUpdate(
      {_id: new ObjectID('59908cdbd180061219b26ca6')}, //filter
      {
        $set: {  //update
          completed: true
        }
      },
      {
        returnOriginal: false
      }
    )
    .then((result) => {
      console.log(result)
    })
    .catch((err) => {
      console.log(err)
    })

  db.collection('Users')
    .findOneAndUpdate({
      name: 'Mike'
    },{
      $set: {
        name: 'Michael'
      },
      $inc: {
        age: 1
      }
    }, {
      returnOriginal: false
    })
    .then((result) => {
      console.log(result)
    })
    .catch((err) => {
      console.log(err)
    })


  db.close()
})
