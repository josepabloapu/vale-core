var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CategorySchema = new Schema({
  name: {type: String, required: true},
  code: {type: String, required: true, unique: true},
  type: {type: String, required: true}, // income - outcome - transfer
  percentage: {type: Number, required: false},
  showInDashboard: {type: Boolean, required: true},
  description: {type: String, required: false},
})

module.exports = mongoose.model('Category', CategorySchema)
