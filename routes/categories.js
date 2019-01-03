
var Category = require('../models/category.js')

module.exports.getAll = function (req, res) {
  Category.find(function (err, categories) {
    if (err) return res.status(500).json({ message: err })
    res.json(categories)
  })
}

module.exports.create = function (req, res) {
  var category = new Category(req.body)
  category.code = category.name.replace(/\s+/g, '-').toLowerCase() + '-' + category.type.toLowerCase()
  category.save(function (err) {
    if (err) return res.status(500).json({ message: err })
    res.send(category)
  })
}

module.exports.getById = function (req, res) {
  Category.findById(req.params.id, function (err, category) {
    if (err) return res.status(500).json({ message: err })
    res.status(200).json(category)
  })
}

module.exports.updateById = function (req, res) {
  Category.findById(req.params.id, function (err, category) {
    if (err) return res.status(500).json({ message: err })
    var key
    for (key in req.body) {
      category[key] = req.body[key]
    }
    category.code = category.name.replace(/\s+/g, '-').toLowerCase() + '-' + category.type.toLowerCase()
    category.save(function (err) {
      if (err) return res.status(500).json({ message: err })
      res.send(category)
    })
  })
}

module.exports.deleteById = function (req, res) {
  Category.findByIdAndRemove(req.params.id, function (err) {
    if (err) return res.status(500).json({ message: err })
    res.status(200).json({ message: 'The entry has been deleted' })
  })
}
