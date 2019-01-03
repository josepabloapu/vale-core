var mongoose = require('mongoose')
var Schema = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose')

var UserSchema = new Schema({
  name: {type: String, required: false},
  username: {type: String, required: true},
  email: {type: String, required: false},
  role: {type: String, required: true, default: 'user'},
  language: {type: String, required: true, default: 'en'},
  currency: {type: String, required: false},
  token: {type: Number, required: false},
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)
