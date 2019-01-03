var Account = require('../models/account.js')
var Currency = require('../models/currency.js')

module.exports.getAll = function(req, res) {

  // only get documents from the current user
  let filter = {
     'owner': req.user._id
  }

  Account.find(filter, function(err, accounts) {
    if (err) return res.send(err)
    res.send(accounts)
  })

  // .populate('owner currency')

}

module.exports.create = function(req, res) {
  
  // bypass desired properties
  var account = new Account()
  var key
  for (key in req.body) {
    if (key == 'name' || key == 'description' || key == 'type' || key == 'currency' || key == 'initialBalance') {
      account[key] = req.body[key]  
    }
  }

  account.owner = req.user._id

  Currency.findById(account.currency, function(err, currency) {

    // check for errors and constraints
    if (err) return res.send(err)
    if (currency == null) return res.send({ message: "Unable to create the account. Currency document not found" })
    if (account.name == null || currency.code == null) return res.send({ message: "Unable to create the account. Name and/or currency might be set incorrectly." })
    
    account.code = account.name.replace(/\s+/g, '-').toLowerCase() + '-' + currency.code.toLowerCase()
    account.balance = account.initialBalance
    
    // save document
    account.save(function(err) {
      if (err) return res.send(err)
      res.send(account)
    })

  })

}

module.exports.getById = function(req, res) {

  Account.findById(req.params.id, function(err, account) {

    // check for errors and constraints
    if (err) return res.send(err)
    if (account == null) return res.send({ message: "Document not found"})
    if (!req.user._id.equals(account.owner._id)) return res.send({ message: "Unauthorized" })
    
    // retrieve document
    res.send(account)

  })

  // .populate('owner currency')
}

module.exports.updateById = function(req, res) {
  
  Currency.findById(req.body.currency, function(err, currency) {

    // check for errors and constraints
    if (err) return res.send(err)
    if (currency == null) return res.send({ message: "Document not found"})

    Account.findById(req.params.id, function(err, account) {
      
      // check for errors and constraints
      if (err) return res.send(err)
      if (account == null) return res.send({ message: "Document not found"})
      if (!req.user._id.equals(account.owner._id)) return res.send({ message: "Unauthorized" })
      
      // bypass desired properties
      var key
      for (key in req.body) {
        if (key == 'name' || key == 'description' || key == 'type' || key == 'currency' || key == 'initialBalance') {
          account[key] = req.body[key]  
        }
      }
  
      // Compute the new balance of the account
      account.balance = account.initialBalance + account.cumulativeInflow - account.cumulativeOutflow
  
      // COmpute the new code
      account.code = account.name.replace(/\s+/g, '-').toLowerCase() + '-' + currency.code.toLowerCase()
  
      // Save document
      account.save(function(err) {
        if (err) return res.send(err)
        res.send(account)
      })
  
    })

    // .populate('owner currency')

  })
    
}

module.exports.deleteById = function(req, res) {

  Account.findById(req.params.id, function(err, account) {

    // check for errors and constraints
    if (err) return res.send(err)
    if (account == null) return res.send({ message: "Document not found"})
    if (!req.user._id.equals(account.owner._id)) return res.send({ message: "Unauthorized" })
    
    // remove document
    account.remove(function(err) {
      if (err) return res.send(err)
      console.log(account)
      res.send(account)
    })

  })

  // .populate('owner currency')

}
