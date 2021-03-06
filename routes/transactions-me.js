var Transaction = require('../models/transaction.js')
var Account = require('../models/account.js')

module.exports.getAll = function(req, res) {

  // FIlter transactions and only show up the ones owned by the current user
  let filter = { 'owner': req.user._id }
  Transaction.find(filter, function(err, transactions) {
    if (err) return res.status(500).send(err)
    res.status(200).send(transactions)
  })

  // Sort data, and make the last entry to be in the 1st position
  .sort({ date: -1 })

  // .populate('owner account category currency')

}

module.exports.get = function(req, res) {

  // FIlter transactions and only show up the ones owned by the current user
  let filter = { 'owner': req.user._id }
  Transaction.find(filter, function(err, transactions) {
    if (err) return res.status(500).send(err)
    res.status(200).send(transactions)
  })

  // Sort data, and make the last entry to be in the 1st position
  .sort({ date: -1 })

  // Limit the entries 
  .limit(100)

  // .populate('owner account category currency')

}

module.exports.create = function(req, res) {

  var transaction = new Transaction()

  // bypass desired properties
  var key
  for (key in req.body) {
    if (key == 'type' || key == 'account' || key == 'currency' || key == 'category' || key == 'amount' || key == 'date' ||key == 'description') {
      transaction[key] = req.body[key]  
    }
  }

  // check constraints
  if (transaction['amount'] == null) return res.status(403).send({message: 'Amount property is not valid'})
  if (transaction['type'] == null) return res.status(403).send({message: 'Type property is not valid'})
  if (transaction['currency'] == null) return res.status(403).send({message: 'Currency property is not valid'})
  if (transaction['category'] == null) return res.status(403).send({message: 'Category property is not valid'})

  transaction.owner = req.user._id

  if (transaction['account'] == null || transaction['account'] == "") {

    transaction.save(function(err) {
      if (err) {
        return res.status(500).send(err)
      }
      return res.status(201).send({ transaction: transaction })
    })

  } else {

    // Find the account to be updated
    Account.findById(transaction.account, function(err, account) {
    
      // check for errors and constraints
      if (err) return res.status(500).send(err)
      if (account == null) return res.status(404).send({ message: "Account document not found"})
      if (!req.user._id.equals(account.owner._id)) return res.status(401).send({ message: "Unauthorized" })
    
      // Look for the transaction type to update the inflow or the outflow
      switch(transaction.type) {
        case 'expense':
          account['cumulativeOutflow'] = account['cumulativeOutflow'] + transaction.amount
          break
        case 'income':
          account['cumulativeInflow'] = account['cumulativeInflow'] + transaction.amount
          break
        default:
          return res.status(403).send({ message: "Invalid transaction type"})
      }
    
      // Compute the new balance of the account
      account['balance'] = account['initialBalance'] + account['cumulativeInflow'] - account['cumulativeOutflow']
    
      // Update the account and the transaction
      transaction.save(function(err) {
        if (err) return res.status(500).send(err)
        account.save(function(err) {
          if (err) return res.status(500).send(err)
          return res.status(201).send({ transaction: transaction, account: account })
        })
      })
    
    })

  }

}

module.exports.getById = function(req, res) {
  
  // Look for the transaction that matches the provided _id
  Transaction.findById(req.params.id, function(err, transaction) {
    
    if (err) return res.status(500).send(err)
    if (transaction == null) return res.status(404).send({ message: "Transaction document not found"})
    if (!req.user._id.equals(transaction.owner._id)) return res.status(401).send({ message: "Unauthorized" })
    
    res.status(200).send(transaction)

  })

  // .populate('owner account category currency')

}

module.exports.updateById = function(req, res) {

  Transaction.findById(req.params.id, function(err, transaction) {

    // check for errors and constraints
    if (err) return res.status(500).send(err)
    if (transaction == null) return res.status(404).send({ message: "Transaction document not found"})
    if (!req.user._id.equals(transaction.owner._id)) return res.status(401).send({ message: "Unauthorized" })

    // Find the account to be updated
    Account.findById(transaction.account, function(err, oldAccount) {

      if (err) return res.status(500).send(err)
      if (oldAccount == null) return res.status(404).send({ message: "Account document not found"})
      if (!req.user._id.equals(oldAccount.owner._id)) return res.status(401).send({ message: "Unauthorized" })

      // Look for the transaction type to update the inflow or the outflow
      switch(transaction.type) {
        case 'expense':
          oldAccount['cumulativeOutflow'] = oldAccount['cumulativeOutflow'] - transaction.amount
          break
        case 'income':
          oldAccount['cumulativeInflow'] = oldAccount['cumulativeInflow'] - transaction.amount
          break
        default:
          return res.status(403).send({ message: "Invalid transaction type"})
      }
  
      // Compute the new balance of the oldAccount
      oldAccount['balance'] = oldAccount['initialBalance'] + oldAccount['cumulativeInflow'] - oldAccount['cumulativeOutflow']
  
      // Update the oldAccount and remove the transaction
      oldAccount.save(function(err) {
        if (err) return res.status(500).send(err)

        // bypass desired properties
        var key
        for (key in req.body) {
          if (key == 'type' || key == 'account' || key == 'currency' || key == 'category' || key == 'amount' || key == 'date' ||key == 'description') {
            transaction[key] = req.body[key]  
          }
        }

        // check constraints
        if (transaction['amount'] == null) return res.status(403).send({message: 'Amount property is not valid'})
        if (transaction['currency'] == null) return res.status(403).send({message: 'Currency property is not valid'})
        if (transaction['category'] == null) return res.status(403).send({message: 'Category property is not valid'})

        // Find the newAccount to be updated
        Account.findById(transaction.account, function(err, newAccount) {
    
          if (err) return res.status(500).send(err)
          if (newAccount == null) return res.status(404).send({ message: "Account document not found"})
          if (!req.user._id.equals(newAccount.owner._id)) return res.status(401).send({ message: "Unauthorized" })

          // Look for the transaction type to update the inflow or the outflow
          switch(transaction.type) {
            case 'expense':
              newAccount['cumulativeOutflow'] = newAccount['cumulativeOutflow'] + transaction.amount
              break
            case 'income':
              newAccount['cumulativeInflow'] = newAccount['cumulativeInflow'] + transaction.amount
              break
            default:
              return res.status(403).send({ message: "Invalid transaction type"})
          }
      
          // Compute the new balance of the account
          newAccount['balance'] = newAccount['initialBalance'] + newAccount['cumulativeInflow'] - newAccount['cumulativeOutflow']

          // Update the newAccount and the transaction
          newAccount.save(function(err) {
            if (err) return res.status(500).send(err)   
            transaction.save(function(err) {
              if (err) return res.status(500).send(err)
              res.status(200).send({ transaction: transaction, oldAccount: oldAccount, newAccount: newAccount})
            })
          })
            
        })

      })

    })

  })

}

module.exports.deleteById = function(req, res) {

  Transaction.findById(req.params.id, function(err, transaction) {

    // check for errors and constraints
    if (err) return res.status(500).send(err)
    if (transaction == null) return res.status(404).send({ message: "Transaction document not found"})
    if (!req.user._id.equals(transaction.owner._id)) return res.status(401).send({ message: "Unauthorized" })

    // Find the account to be updated
    Account.findById(transaction.account, function(err, account) {

      if (err) return res.status(500).send(err)
      
      // Account not found. Force transaction removal
      if (account == null) {
        transaction.remove()
        return res.status(206).send({ message: "Account document not found. But Transaction was removed successfully", transaction: transaction })
      }

      // If account is found. make sure the user has the rights to do so.
      if (!req.user._id.equals(account.owner._id)) return res.status(401).send({ message: "Unauthorized" })

      // Look for the transaction type to update the inflow or the outflow
      switch(transaction.type) {
        case 'expense':
          account['cumulativeOutflow'] = account['cumulativeOutflow'] - transaction.amount
          break
        case 'income':
          account['cumulativeInflow'] = account['cumulativeInflow'] - transaction.amount
          break
        default:
          return res.status(403).send({ message: "Invalid transaction type"})
      }
  
      // Compute the new balance of the account
      account['balance'] = account['initialBalance'] + account['cumulativeInflow'] - account['cumulativeOutflow']
  
      // Update the account and remove the transaction
      account.save(function(err) {
        if (err) return res.status(500).send(err)
        transaction.remove()
        res.status(200).send(transaction)
      })

    })

  })

  // .populate('owner account category currency')

}
