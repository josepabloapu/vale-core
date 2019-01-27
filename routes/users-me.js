var passport = require('passport')
var User = require('../models/user.js')

module.exports.get = function (req, res) {
  User.findById(req.user._id, function (err, user) {
    if (err) return res.status(500).send(err)
    res.status(200).json(user)
  })
}

module.exports.update = function (req, res) {
  User.findById(req.user._id, function (err, user) {
    if (err) return res.status(500).send(err)

    // bypass desired properties
    var key
    for (key in req.body) {
      if (key == 'name' || key == 'email' || key == 'language' || key == 'currency') {
        user[key] = req.body[key]  
      }
    }

    user.save(function (err) {
      if (err) return res.status(500).send(err)
      res.status(200).send(user)
    })
  })
}

module.exports.delete = function (req, res) {
  User.findByIdAndRemove(req.user._id, function (err, user) {
    if (err) return res.status(500).send(err)
    res.status(200).json(user)
  })
}