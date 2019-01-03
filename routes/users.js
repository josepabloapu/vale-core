var passport = require('passport')
var User = require('../models/user.js')

module.exports.getAll = function (req, res) {
  User.find(function (err, users) {
    if (err) return res.status(500).send(err)
    res.send(users)
  })
}

module.exports.create = function (req, res) {
  
  var user = new User()

  // bypass desired properties
  var key
  for (key in req.body) {
    if (key == 'username' || key == 'name' || key == 'email' || key == 'language' || key == 'currency') {
      user[key] = req.body[key]  
    }
  }

  User.register(new User(user), req.body.password, function (err, user) {
    if (err) return res.status(500).json({ message: err })
    passport.authenticate('local')(req, res, function () {
      return res.status(200).send(user)
    })
  })

}

module.exports.getById = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.send(err)
    res.status(200).send(user)
  })
}

module.exports.updateById = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.status(500).json(err)
    var key
    for (key in req.body) {
      user[key] = req.body[key]
    }
    user.save(function (err) {
      if (err) return res.status(500).json(err)
      res.status(200).send(user)
    })
  })
}

module.exports.deleteById = function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err) {
    if (err) return res.status(500).json({ message: err })
    res.status(200).send()
  })
}
