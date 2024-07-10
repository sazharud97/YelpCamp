const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const User = require('../models/user');
const users = require('../controllers/users')
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const user = require('../models/user');

router.get('/register', users.renderRegister)

//! POST ROUTE (submit button)
router.post('/register', catchAsync(users.register));

router.get('/login', users.renderLogin)

// passport authenticates using local strategy and implements options specified below
router.post('/login',
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    users.login);

router.get('/logout', users.logout)

module.exports = router;