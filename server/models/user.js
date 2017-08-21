const mongoose = require('mongoose'),
  validator = require('validator'),
  jwt = require('jsonwebtoken'),
  _ = require('lodash'),
  bcrypt = require('bcryptjs')

require('dotenv').config()
const {JWT_SECRET} = process.env

const UserSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: true,
    minLength: 1,
    trim: true,
    validate: {
      isAsync: false,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }],
  name: {
    type: String
  }
})

UserSchema.methods.toJSON = function () {
  let user = this
  let userObject = user.toObject()

  return _.pick(userObject, ['email', '_id', 'name'])
}
UserSchema.methods.generateAuthToken = function () {
  let user = this
  const access = 'auth'
  let token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, JWT_SECRET).toString()

  user.tokens.push({access, token})
  return user.save().then(() => token)
}

UserSchema.methods.removeToken = function (token) {
  let user = this
  return user.update({
    $pull: {
      tokens: { token }
    }
  })
}

UserSchema.statics.findByToken = function (token) {
  let User = this
  let decoded

  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return Promise.reject(err)
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this
  return User.findOne({email})
    .then((user) => {
      if (!user) {
        return Promise.reject()
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user)
          } else {
            reject()
          }
        })
      })
    })
}

UserSchema.pre('save', function (next) {
  let user = this

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) =>{
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = {User}
