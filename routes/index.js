var express = require('express')
var router = express.Router()

var auth = require('./auth')
var users = require('./users')
var currencies = require('./currencies')
var categories = require('./categories')
var accountTypes = require('./accountTypes')
var accounts = require('./accounts')
var transactions = require('./transactions')
var dashboard = require('./dashboard')

var myUser = require('./users-me')
var myAccounts = require('./accounts-me')
var myTransactions = require('./transactions-me')

/* API-Key Validation */
/**********************/

router.route('*')
  .get(auth.validateAPIKey)
  .post(auth.validateAPIKey)
  .put(auth.validateAPIKey)
  .delete(auth.validateAPIKey)

/* Non-Restricted routes */
/*************************/

/* Auth routes */
router.route('/auth/register')
  .post(users.create)
router.route('/auth/login')
  .post(auth.login, auth.createToken)

/* Currencies routes */
router.route('/currencies')
  .get(currencies.getAll)
  // .post(auth.verifyToken, currencies.create)
router.route('/currencies/:id')
  .get(currencies.getById)
  // .put(auth.verifyToken, currencies.updateById)
  // .delete(auth.verifyToken, currencies.deleteById)

/* Categories routes */
router.route('/categories')
  .get(categories.getAll)
  // .post(auth.verifyToken, categories.create)
router.route('/categories/:id')
  .get(categories.getById)
  // .put(auth.verifyToken, categories.updateById)
  // .delete(auth.verifyToken, categories.deleteById)

/* Account types routes */
router.route('/accountTypes')
  .get(accountTypes.getAll)
  // .post(auth.verifyToken, accountTypes.create)
router.route('/accountTypes/:id')
  .get(accountTypes.getById)
  // .put(auth.verifyToken, accountTypes.updateById)
  // .delete(auth.verifyToken, accountTypes.deleteById)

/* Admin-Restricted routes */
/***************************/

/* Users routes */
router.route('/admin/users')
  .get(auth.verifyToken, auth.verifyAdmin, users.getAll)
  .post(auth.verifyToken, auth.verifyAdmin, users.create)
router.route('/admin/users/:id')
  .get(auth.verifyToken, auth.verifyAdmin, users.getById)
  .put(auth.verifyToken, auth.verifyAdmin, users.updateById)
  .delete(auth.verifyToken, auth.verifyAdmin, users.deleteById)
/* Currencies routes */
router.route('/admin/currencies')
  .get(auth.verifyToken, auth.verifyAdmin, currencies.getAll)
  .post(auth.verifyToken, auth.verifyAdmin, currencies.create)
router.route('/admin/currencies/:id')
  .get(auth.verifyToken, auth.verifyAdmin, currencies.getById)
  .put(auth.verifyToken, auth.verifyAdmin, currencies.updateById)
  .delete(auth.verifyToken, auth.verifyAdmin, currencies.deleteById)
/* Categories routes */
router.route('/admin/categories')
  .get(auth.verifyToken, auth.verifyAdmin, categories.getAll)
  .post(auth.verifyToken, auth.verifyAdmin, categories.create)
router.route('/admin/categories/:id')
  .get(auth.verifyToken, auth.verifyAdmin, categories.getById)
  .put(auth.verifyToken, auth.verifyAdmin, categories.updateById)
  .delete(auth.verifyToken, auth.verifyAdmin, categories.deleteById)
/* Currencies routes */
router.route('/admin/accountTypes')
  .get(auth.verifyToken, auth.verifyAdmin, accountTypes.getAll)
  .post(auth.verifyToken, auth.verifyAdmin, accountTypes.create)
router.route('/admin/accountTypes/:id')
  .get(auth.verifyToken, auth.verifyAdmin, accountTypes.getById)
  .put(auth.verifyToken, auth.verifyAdmin, accountTypes.updateById)
  .delete(auth.verifyToken, auth.verifyAdmin, accountTypes.deleteById)
/* Accounts routes */
router.route('/admin/accounts')
  .get(auth.verifyToken, auth.verifyAdmin, accounts.getAll)
  .post(auth.verifyToken, auth.verifyAdmin, accounts.create)
router.route('/admin/accounts/:id')
  .get(auth.verifyToken, auth.verifyAdmin, accounts.getById)
  .put(auth.verifyToken, auth.verifyAdmin, accounts.updateById)
  .delete(auth.verifyToken, auth.verifyAdmin, accounts.deleteById)
/* Payments routes */
router.route('/admin/transactions')
  .get(auth.verifyToken, auth.verifyAdmin, transactions.getAll)
  .post(auth.verifyToken, auth.verifyAdmin, transactions.create)
router.route('/admin/transactions/:id')
  .get(auth.verifyToken, auth.verifyAdmin, transactions.getById)
  .put(auth.verifyToken, auth.verifyAdmin, transactions.updateById)
  .delete(auth.verifyToken, auth.verifyAdmin, transactions.deleteById)

/* User-Restricted routes */

/* Auth routes */
router.route('/auth/logout')
  .post(auth.verifyToken, auth.removeToken)
router.route('/auth/verifyToken')
  .get(auth.verifyToken, auth.sendTrueValue)

/* Users routes */
router.route('/users/me')
  .get(auth.verifyToken, myUser.get)
  .put(auth.verifyToken, myUser.update)
  .delete(auth.verifyToken, myUser.delete)

/* Accounts routes */
router.route('/accounts')
  .get(auth.verifyToken, myAccounts.getAll)
  .post(auth.verifyToken, myAccounts.create)
router.route('/accounts/:id')
  .get(auth.verifyToken, myAccounts.getById)
  .put(auth.verifyToken, myAccounts.updateById)
  .delete(auth.verifyToken, myAccounts.deleteById)

/* Payments routes */
router.route('/transactions')
  .get(auth.verifyToken, myTransactions.get)
  .post(auth.verifyToken, myTransactions.create)
router.route('/transactions/:id')
  .get(auth.verifyToken, myTransactions.getById)
  .put(auth.verifyToken, myTransactions.updateById)
  .delete(auth.verifyToken, myTransactions.deleteById)
router.route('/transactions-all')
  .get(auth.verifyToken, myTransactions.getAll)

router.route('/stats/balance-per-account/accounts/:account/date/:date/currency/:currency/type/:type').get(auth.verifyToken, dashboard.getAccountBalance)
router.route('/stats/balance-per-category/categories/:category/date/:date/currency/:currency').get(auth.verifyToken, dashboard.getCategoryBalance)

module.exports = router
