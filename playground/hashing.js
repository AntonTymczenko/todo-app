/*
// SHA 256

const {SHA256} = require('crypto-js')

let message = "I am user number 3"
let hash = SHA256(message).toString()

console.log(`Message: ${message}`)
console.log(`hash: ${hash}`)

let data = {
  id: 4
}
let token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'some secret').toString()
}

token.data.id = 5
token.hash = SHA256(JSON.stringify(token.data)).toString()

let resultHash = SHA256(JSON.stringify(token.data) + 'some secret').toString()

if (resultHash === token.hash) {
  console.log('Data was not changed')
} else {
  console.log('data was changed. corruption! dont trust')
}
*/

/*
const jwt = require('jsonwebtoken')
const secret = '123abc'

let data = {
  id: 10
}

let token = jwt.sign(data, secret)
console.log(token)

let decoded = jwt.verify(token, secret)
console.log(`decoded ${JSON.stringify(decoded)}`)

*/


const bcrypt = require('bcryptjs')
const password = '1234abcd'

// bcrypt.genSalt(10, (err, salt) =>{
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash)
//   })
// })


let hashedPassword = '$2a$10$o7X1CL7IvH/qapIYgZuJs.RIOvHuNO.uxdhCa.ORW0GR2yMWdS1lO'

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res)
})
