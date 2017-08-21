const mongoose = require('mongoose')

require('dotenv').config()
const {NODE_ENV, MONGODB_URI, MONGODB_URI_TEST} = process.env

mongoose.Promise = global.Promise
mongoose.connect(NODE_ENV==='test'? MONGODB_URI_TEST : MONGODB_URI,  {useMongoClient: true})

module.exports = {
  mongoose
}
