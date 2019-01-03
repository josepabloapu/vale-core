var Transaction = require('../models/transaction.js')

module.exports.getAll = function(req, res) {

  // Show all transactions
  Transaction.find(function(err, transactions) {
    if (err) return res.send(err)
    res.send(transactions)
  })
  // .populate('owner account category currency')
}

module.exports.create = function(req, res) {

  var transaction = new Transaction(req.body)
  transaction.save(function(err) {
    if (err) return res.send(err)
    res.send(transaction)
  })
}

module.exports.getById = function(req, res) {

  Transaction.findById(req.params.id, function(err, transaction) {
    if (err) return res.send(err)
    res.send(transaction)
  })
  // .populate('owner account category currency')
}

module.exports.updateById = function(req, res) {

  Transaction.findById(req.params.id, function(err, transaction) {

    if (err) return res.send(err)
    
    var key
    for (key in req.body) {
      transaction[key] = req.body[key]
    }
    
    transaction.save(function(err) {
      if (err) return res.send(err)
      res.send(transaction)
    })
    
  })
  // .populate('owner account category currency')
}

module.exports.deleteById = function(req, res) {
  Transaction.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.send(err)
    res.send()
  })
  // .populate('owner account category currency')
}