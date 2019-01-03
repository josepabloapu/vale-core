var Account = require('../models/account.js')

module.exports.getAll = function(req, res) {
  Account.find(function(err, accounts) {
    if (err) return res.send(err)
    res.send(accounts)
  })
  // .populate('owner currency')
}

module.exports.create = function(req, res) {
  var account = new Account(req.body)
  account.save(function(err) {
    if (err) return res.send(err)
    res.send(account)
  })
}

module.exports.getById = function(req, res) {
  Account.findById(req.params.id, function(err, account) {
    if (err) return res.send(err)
    res.send(account)
  })
  // .populate('owner currency')
}

module.exports.updateById = function(req, res) {
  Account.findById(req.params.id, function(err, account) {
    if (err) return res.send(err)
    var key
    for (key in req.body) {
      account[key] = req.body[key]
    }
    account.save(function(err) {
      if (err) return res.send(err)
      res.send(account)
    })
  })
  // .populate('owner currency')
}

module.exports.deleteById = function(req, res) {
  Account.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.send(err)
    res.send()
  })
  // .populate('owner currency')
}
