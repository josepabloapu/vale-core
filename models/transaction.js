var mongoose = require('mongoose')
var Schema = mongoose.Schema

var TransactionSchema = new Schema({
  
  // The date and time of the transaction is stored here.
  date: { 
    type: Date, 
    default: Date.now
  },

  // The owner of the transaction is stored here.
  owner: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // The currency of the transaction is stored here.
  currency: { 
    type: Schema.Types.ObjectId, 
    ref: 'Currency', 
    required: true 
  },

  // The account of the transaction is stored here.
  account: { 
    type: Schema.Types.ObjectId, 
    ref: 'Account', 
    required: true 
  },
  
  // The category of the transaction is stored here.
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  
  // The type of the transaction is stored here. It could be income, expense or transfer.
  type: {
    type: String, 
    required: true
  },

  // The amount of the transaction is stored here.
  amount: {
    type: Number, 
    required: true
  },

  // The description of the transaction is stored here.
  description: {
    type: String, 
    required: false
  }

})

module.exports = mongoose.model('Transaction', TransactionSchema)