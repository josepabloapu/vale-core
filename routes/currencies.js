
var Currency = require('../models/currency.js')

module.exports.getAll = function (req, res) {
  Currency.find(function (err, currencies) {
    if (err) { res.send(err) }
    res.json(currencies)
  })
}

module.exports.create = function (req, res) {
  var currency = new Currency(req.body)
  currency.save(function (err) {
    if (err) return res.status(500).json({ message: err })
    res.send(currency)
  })
}

module.exports.getById = function (req, res) {
  Currency.findById(req.params.id, function (err, currency) {
    if (err) return res.status(500).json({ message: err })
    res.status(200).json(currency)
  })
}

module.exports.updateById = function (req, res) {
  Currency.findById(req.params.id, function (err, currency) {
    if (err) return res.status(500).json({ message: err })
    var key
    for (key in req.body) {
      currency[key] = req.body[key]
    }
    currency.save(function (err) {
      if (err) return res.status(500).json({ message: err })
      res.send(currency)
    })
  })
}

module.exports.deleteById = function (req, res) {
  Currency.findByIdAndRemove(req.params.id, function (err) {
    if (err) return res.status(500).json({ message: err })
    res.status(200).json({ message: 'The entry has been deleted' })
  })
}
