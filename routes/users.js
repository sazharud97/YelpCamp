const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
})

//! POST ROUTE (submit button)
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        // takes new user and hashes password tied to user
        const registeredUser = await User.register(user, password);
        req.flash('success', `Welcome to YelpCamp, ${registeredUser.username}!`);
        res.redirect('/campgrounds');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

// passport authenticates using local strategy and implements options specified below
router.post('/login',
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    (req, res) => {
        const { username } = req.body;
        req.flash('success', `Welcome back, ${username}`);
        res.redirect('/campgrounds');
    });

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', `Goodbye for now, you're leaving town, for a while :)`)
        res.redirect('/campgrounds');
    });
})
module.exports = router;