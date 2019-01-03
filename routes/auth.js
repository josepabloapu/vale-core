var passport = require('passport')
var User = require('../models/user.js')

var apiKey = 'WJtWBVdivPCn5wtPruA8Nj6Tb6JQv76y'

module.exports.login = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) return res.status(500).json({ message: err })
    if (!user) return res.status(401).json({ message: info })
    req.logIn(user, function (err) {
      if (err) return res.status(500).json({ message: err })
      next() 
    })
  })(req, res, next)
}

module.exports.createToken = function (req, res) {
  // Asynchronous token generator
  var tokenBytes = 8
  require('crypto').randomBytes(tokenBytes, function (err, buffer) {
    if (err) return res.status(500).json({message: err})
    var token = parseInt(buffer.toString('hex'), 16)
    // Update token field
    User.findById(req.user._id, function (err, user) {
      if (err) return res.status(500).json({message: err})
      user.token = token
      // console.log('The user ' + user.username + ' has new token: ' + user.token)
      // Update user
      user.save(function (err) {
        if (err) return res.status(500).json({message: err})
        res.status(200).json(user)
      })
    })
  })
}

module.exports.removeToken = function (req, res) {
  User.findById(req.user._id, function (err, user) {
    if (err) return res.status(500).json({message: err})
    user.token = undefined // Delete token
    user.save(function (err) {
      if (err) return res.status(500).json({message: err})
      res.status(200).json({ message: 'Token has been removed from user ' + user.username })
    })
  })
}

module.exports.verifyToken = passport.authenticate('bearer', { session: false })

module.exports.verifyAdmin = function (req, res, next) {
  if (req.user.role == 'admin') { 
    return next() 
  }
  return res.status(400).json({ message: 'Access Denied' })
}

module.exports.sendTrueValue = function (req, res) {
  User.findById(req.user._id, function (err, user) {
    if (err) return res.status(500).json({message: err})
    return res.status(200).json({ message: 'Token is valid', value: true, user: user })
  })
}

module.exports.validateAPIKey = function (req, res, next) {
  if (req.headers['api-key'] == apiKey) return next() 
  return res.status(400).json({ message: 'Invalid API Key' })
}
