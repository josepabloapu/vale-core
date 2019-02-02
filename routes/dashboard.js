var mongoose = require('mongoose')
var moment = require('moment')
var Transaction = require('../models/transaction.js')

filterByDate = function (term) {
  let dateFilter
  switch(term) {
    case 'today':
      dateFilter = {
        $gte: new Date(moment().clone().startOf('day')),
        $lt: new Date(moment().clone().endOf('day'))
      }
      break
    case 'yesterday':
      dateFilter = {
        $gte: new Date(moment().clone().subtract(1, 'day').startOf('day')),
        $lt: new Date(moment().clone().subtract(1, 'day').endOf('day'))
      }
      break
    case 'this-week':
      dateFilter = {
        $gte: new Date(moment().clone().startOf('week')),
        $lt: new Date(moment().clone().endOf('week'))
      }
      break
    case 'last-week':
      dateFilter = {
        $gte: new Date(moment().clone().subtract(1, 'week').startOf('week')),
        $lt: new Date(moment().clone().subtract(1, 'week').endOf('week'))
      }
      break
    case 'this-month':
      dateFilter = {
        $gte: new Date(moment().clone().startOf('month')),
        $lt: new Date(moment().clone().endOf('month'))
      }
      break
    case 'last-month':
      dateFilter = {
        $gte: new Date(moment().clone().subtract(1, 'month').startOf('month')),
        $lt: new Date(moment().clone().subtract(1, 'month').endOf('month'))
      }
      break
    case 'this-year':
      dateFilter = {
        $gte: new Date(moment().clone().subtract(1, 'year').endOf('month')),
        $lt: new Date(moment().clone().endOf('year'))
      }
      break
    case 'last-year':
      dateFilter = {
        $gte: new Date(moment().clone().subtract(1, 'year').startOf('year')),
        $lt: new Date(moment().clone().subtract(1, 'year').endOf('year'))
      }
      break
    default:
      dateFilter = {
        $lt: new Date(moment())
      }
  }
  return dateFilter
}

exports.getAccountBalance = function (req, res, next) {
  Transaction.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId(req.user._id),
        account: mongoose.Types.ObjectId(req.params.account),
        date: filterByDate(req.params.date),
        currency: mongoose.Types.ObjectId(req.params.currency),
        type: req.params.type
      }
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
    if (result.length == 0) return res.json(0)  
    res.json(result[0].amount)
  })
}

exports.getCategoryBalance = function (req, res, next) {
  Transaction.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId(req.user._id),
        category: mongoose.Types.ObjectId(req.params.category),
        date: filterByDate(req.params.date),
        currency: mongoose.Types.ObjectId(req.params.currency)
      }
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
