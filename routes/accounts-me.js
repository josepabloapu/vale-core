var Account = require('../models/account.js')
var Currency = require('../models/currency.js')

module.exports.getAll = function(req, res) {

  // only get documents from the current user
  let filter = {
     'owner': req.user._id
  }

  Account.find(filter, function(err, accounts) {
    if (err) return res.status(500).send(err)
    res.status(200).send(accounts)
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

  // check constraints
  if (account['name'] == null) return res.status(403).send({message: 'Name property is not valid'})
  if (account['type'] == null) return res.status(403).send({message: 'Type property is not valid'})
  if (account['currency'] == null) return res.status(403).send({message: 'Currency property is not valid'})
  if (account['initialBalance'] == null) return res.status(403).send({message: 'Initial Balance property is not valid'})

  if (account.name == null) return res.status(401).send({ message: "Account property is not valid." })

  account.owner = req.user._id

  Currency.findById(account.currency, function(err, currency) {

    // check for errors and constraints
    if (err) return res.status(500).send(err)
    if (currency == null) return res.status(404).send({ message: "Currency document not found" })
    
    account.balance = account.initialBalance
    
    // save document
    account.save(function(err) {
      if (err) return res.status(500).send(err)
      res.status(201).send(account)
    })

  })

}

module.exports.getById = function(req, res) {

  Account.findById(req.params.id, function(err, account) {

    // check for errors and constraints
    if (err) return res.status(500).send(err)
    if (account == null) return res.status(404).send({ message: "Account document not found"})
    if (!req.user._id.equals(account.owner._id)) return res.status(401).send({ message: "Unauthorized" })
    
    // retrieve document
    res.status(500).send(account)

  })

  // .populate('owner currency')
}

module.exports.updateById = function(req, res) {
  
  Currency.findById(req.body.currency, function(err, currency) {

    // check for errors and constraints
    if (err) return res.status(500).send(err)
    if (currency == null) return res.status(404).send({ message: "Currency document not found"})

    Account.findById(req.params.id, function(err, account) {
      
      // check for errors and constraints
      if (err) return res.status(500).send(err)
      if (account == null) return res.status(404).send({ message: "Account document not found"})
      if (!req.user._id.equals(account.owner._id)) return res.status(401).send({ message: "Unauthorized" })
      
      // bypass desired properties
      var key
      for (key in req.body) {
        if (key == 'name' || key == 'description' || key == 'type' || key == 'currency' || key == 'initialBalance') {
          account[key] = req.body[key]  
        }
      }

      // check constraints
      if (account['name'] == null) return res.status(403).send({message: 'Name property is not valid'})
      if (account['type'] == null) return res.status(403).send({message: 'Type property is not valid'})
      if (account['currency'] == null) return res.status(403).send({message: 'Currency property is not valid'})
      if (account['initialBalance'] == null) return res.status(403).send({message: 'Initial Balance property is not valid'})
  
      // Compute the new balance of the account
      account.balance = account.initialBalance + account.cumulativeInflow - account.cumulativeOutflow
  
      // Save document
      account.save(function(err) {
        if (err) return res.status(500).send(err)
        res.status(200).send(account)
      })
  
    })

    // .populate('owner currency')

  })
    
}

module.exports.deleteById = function(req, res) {

  Account.findById(req.params.id, function(err, account) {

    // check for errors and constraints
    if (err) return res.status(500).send(err)
    if (account == null) return res.status(404).send({ message: "Account document not found"})
    if (!req.user._id.equals(account.owner._id)) return res.status(401).send({ message: "Unauthorized" })
    
    // remove document
    account.remove(function(err) {
      if (err) return res.status(500).send(err)
      res.status(200).send(account)
    })

  })

  // .populate('owner currency')

}
