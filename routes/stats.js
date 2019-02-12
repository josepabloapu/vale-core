var mongoose = require('mongoose')
var moment = require('moment')
var Transaction = require('../models/transaction.js')

exports.getBalance = function (req, res, next) {

  let filterRules = {};

  // bypass desired properties
  var key
  for (key in req.body) {
    if (key == 'type') {
      if(req.body[key] != null) filterRules[key] = req.body[key]  
    }
  }
  for (key in req.body) {
    if (key == 'owner' || key == 'account' || key == 'currency' || key == 'category')
      if(req.body[key] != null) filterRules[key] = mongoose.Types.ObjectId(req.body[key])
  }

  filterRules.owner = req.user._id

  if(req.body['dateStart'] != null && req.body['dateEnd'] != null) {
    console.log('it has a date')
    filterRules.date = {
      $gte: new Date(req.body['dateStart']),
      $lt: new Date(req.body['dateEnd'])
    }
  }

  console.log(filterRules)

  Transaction.aggregate([
    {
      $match: filterRules
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        amount: { $sum: "$amount" }
      }
    }
  ], function (err, result) {
    if (err) return res.send(err)
    if (result.length == 0) return res.json({_id: null, count: 0, amount: 0})
    console.log(result)
    res.json(result[0])
  })
}
