var Transaction = require('../models/transaction.js')
var Account = require('../models/account.js')

module.exports.getAll = function(req, res) {

  // FIlter transactions and only show up the ones owned by the current user
  let filter = { 'owner': req.user._id }
  Transaction.find(filter, function(err, transactions) {
    if (err) return res.send(err)
    res.send(transactions)
  })

  // Sort data, and make the last entry to be in the 1st position
  .sort({ created: -1 })

  // Limit the entries 
  .limit(100)

  // .populate('owner account category currency')

}

module.exports.create = function(req, res) {

  var transaction = new Transaction()

  // bypass desired properties
  var key
  for (key in req.body) {
    if (key == 'amount' || key == 'description' || key == 'type' || key == 'account' || key == 'currency' || key == 'category') {
      transaction[key] = req.body[key]  
    }
  }

  transaction.owner = req.user._id

  // Find the account to be updated
  Account.findById(transaction.account, function(err, account) {

    // check for errors and constraints
    if (err) return res.send(err)
    if (account == null) return res.send({ message: "Account document not found"})
    if (!req.user._id.equals(account.owner._id)) return res.send({ message: "Unauthorized" })

    // Look for the transaction type to update the inflow or the outflow
    switch(transaction.type) {
      case 'expense':
        account['cumulativeOutflow'] = account['cumulativeOutflow'] + transaction.amount
        break
      case 'income':
        account['cumulativeInflow'] = account['cumulativeInflow'] + transaction.amount
        break
      default:
        return res.send({ message: "Invalid transaction type"})
    }

    // Compute the new balance of the account
    account['balance'] = account['initialBalance'] + account['cumulativeInflow'] - account['cumulativeOutflow']

    // Update the account and the transaction
    transaction.save(function(err) {
      if (err) return res.send(err)
      account.save(function(err) {
        if (err) return res.send(err)
        res.send({ transaction: transaction, account: account})
      })
    })
 
  })

}

module.exports.getById = function(req, res) {
  
  // Look for the transaction that matches the provided _id
  Transaction.findById(req.params.id, function(err, transaction) {
    
    if (err) return res.send(err)
    if (transaction == null) return res.send({ message: "Document not found"})
    if (!req.user._id.equals(transaction.owner._id)) return res.send({ message: "Unauthorized" })
    
    res.send(transaction)

  })

  // .populate('owner account category currency')

}

module.exports.updateById = function(req, res) {

  Transaction.findById(req.params.id, function(err, transaction) {

    // check for errors and constraints
    if (err) return res.send(err)
    if (transaction == null) return res.send({ message: "Document not found"})
    if (!req.user._id.equals(transaction.owner._id)) return res.send({ message: "Unauthorized" })

    // Find the account to be updated
    Account.findById(transaction.account, function(err, account) {

      if (err) return res.send(err)
      if (account == null) return res.send({ message: "Account document not found"})
      if (!req.user._id.equals(account.owner._id)) return res.send({ message: "Unauthorized" })
  
      // Look for the transaction type to update the inflow or the outflow
      switch(transaction.type) {
        case 'expense':
          account['cumulativeOutflow'] = account['cumulativeOutflow'] - transaction.amount
          break
        case 'income':
          account['cumulativeInflow'] = account['cumulativeInflow'] - transaction.amount
          break
        default:
          return res.send({ message: "Invalid transaction type"})
      }
  
      // Compute the new balance of the account
      account['balance'] = account['initial_balance'] + account['cumulativeInflow'] - account['cumulativeOutflow']
      
      // bypass desired properties
      var key
      for (key in req.body) {
        if (key == 'amount' || key == 'description' || key == 'type' || key == 'account' || key == 'currency' || key == 'category') {
          transaction[key] = req.body[key]  
        }
      }
  
      // Look for the transaction type to update the inflow or the outflow
      switch(transaction.type) {
        case 'expense':
          account['cumulativeOutflow'] = account['cumulativeOutflow'] + transaction.amount
          break
        case 'income':
          account['cumulativeInflow'] = account['cumulativeInflow'] + transaction.amount
          break
        default:
          return res.send({ message: "Invalid transaction type"})
      }
  
      // Compute the new balance of the account
      account['balance'] = account['initialBalance'] + account['cumulativeInflow'] - account['cumulativeOutflow']
  
      // Update the account and the transaction
      account.save(function(err) {
        if (err) return res.send(err)
        transaction.save(function(err) {
          if (err) return res.send(err)
          res.send({ transaction: transaction, account: account})
        })
      })

    })

  })

}

module.exports.deleteById = function(req, res) {

  // Delete the document 
  Transaction.findById(req.params.id, function(err, transaction) {

    // check for errors and constraints
    if (err) return res.send(err)
    if (transaction == null) return res.send({ message: "Document not found"})
    if (!req.user._id.equals(transaction.owner._id)) return res.send({ message: "Unauthorized" })

    // Find the account to be updated
    Account.findById(transaction.account, function(err, account) {

      if (err) return res.send(err)
      if (account == null) return res.send({ message: "Account document not found"})
      if (!req.user._id.equals(account.owner._id)) return res.send({ message: "Unauthorized" })

      // Look for the transaction type to update the inflow or the outflow
      switch(transaction.type) {
        case 'expense':
          account['cumulativeOutflow'] = account['cumulativeOutflow'] - transaction.amount
          break
        case 'income':
          account['cumulativeInflow'] = account['cumulativeInflow'] - transaction.amount
          break
        default:
          return res.send({ message: "Invalid transaction type"})
      }
  
      // Compute the new balance of the account
      account['balance'] = account['initialBalance'] + account['cumulativeInflow'] - account['cumulativeOutflow']
  
      // Update the account and remove the transaction
      account.save(function(err) {
        if (err) return res.send(err)
        transaction.remove()
        res.send({ message: "Document has been removed", transaction: transaction, account: account })
      })

    })

  })

  // .populate('owner account category currency')

}