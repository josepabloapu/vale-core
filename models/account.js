var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AccountSchema = new Schema({

  // The owner of the transaction is stored here.
  owner: { type: Schema.Types.ObjectId,ref: 'User',required: true },

  // The name of the transaction is stored here.
  name: { 
  	type: String,
  	required: true 
  },

  // The description of the transaction is stored here.
  description: { 
  	type: String,
  	required: false 
  },

	// The type of the transaction is stored here. The expected values for this propety are assets and liabilities.
  type: { 
  	type: String,
  	required: true 
  },

  // The currency of the transaction is stored here.
  currency: { 
  	type: Schema.Types.ObjectId,
  	ref: 'Currency',
  	required: true 
  },

  // The initial balance of the transaction is stored here.
  initialBalance: { 
  	type: Number,
  	default: 0,
  	required: true 
  },

  // The cumulative inflow of the transaction is stored here.
  cumulativeInflow: { 
  	type: Number,
  	default: 0,
  	required: true 
  },

  // The cumulative outflow of the transaction is stored here.
  cumulativeOutflow: { 
  	type: Number,
  	default: 0,
  	required: true 
  },

  // The balance of the transaction is stored here. This is computed by the following operation (cumulative inflow - cumulative outflow - initial balance)
  balance: { 
  	type: Number,
  	default: 0,
  	required: true 
  },

  // The code of the transaction is stored here. Code value is a combination of the name and the currency.
  code: { 
  	type: String,
  	required: true,
  	unique: true 
  }

})

module.exports = mongoose.model('Account', AccountSchema)
