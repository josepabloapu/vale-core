var passport = require('passport')
var User = require('../models/user.js')

module.exports.get = function (req, res) {
  User.findById(req.user._id, function (err, user) {
    if (err) return res.status(500).json({ message: err })
    res.status(200).json(user)
  })
}

module.exports.update = function (req, res) {
  User.findById(req.user._id, function (err, user) {
    if (err) return res.status(500).json({ message: err })
    var key
    for (key in req.body) {
      if (key == 'role') { return res.status(500).json({ message: 'Unable to change the role' }) }
      user[key] = req.body[key] 
    }
    user.save(function (err) {
      if (err) return res.status(500).json({ message: err })
      res.send(user)
    })
  })
}

module.exports.delete = function (req, res) {
  User.findByIdAndRemove(req.user._id, function (err) {
    if (err) return res.status(500).json({ message: err })
    res.status(200).json({ message: 'The user has been deleted' })
  })
}