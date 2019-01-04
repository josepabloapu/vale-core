
var AccountType = require('../models/accountType.js')

module.exports.getAll = function (req, res) {
  AccountType.find(function (err, accountTypes) {
    if (err) { res.send(err) }
    res.json(accountTypes)
  })
}

module.exports.create = function (req, res) {
  var accountType = new AccountType(req.body)
  accountType.save(function (err) {
    if (err) return res.status(500).json({ message: err })
    res.send(accountType)
  })
}

module.exports.getById = function (req, res) {
  AccountType.findById(req.params.id, function (err, accountType) {
    if (err) return res.status(500).json({ message: err })
    res.status(200).json(accountType)
  })
}

module.exports.updateById = function (req, res) {
  AccountType.findById(req.params.id, function (err, accountType) {
    if (err) return res.status(500).json({ message: err })
    var key
    for (key in req.body) {
      accountType[key] = req.body[key]
    }
    accountType.save(function (err) {
      if (err) return res.status(500).json({ message: err })
      res.send(accountType)
    })
  })
}

module.exports.deleteById = function (req, res) {
  AccountType.findByIdAndRemove(req.params.id, function (err) {
    if (err) return res.status(500).json({ message: err })
    res.status(200).json({ message: 'The entry has been deleted' })
  })
}
