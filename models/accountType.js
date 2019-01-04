var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AccountTypeSchema = new Schema({
  name: {type: String, required: true},
  code: {type: String, required: true, unique: true},
  description: {type: String, required: false},
})

module.exports = mongoose.model('AccountType', AccountTypeSchema)
