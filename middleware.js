module.exports.isLoggedIn = (req, res, next) => {
    console.log('REQ.USER...', req.user);
    if (!req.isAuthenticated()) {
        // store url user tried to access
        // redirect there after log in
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in to continue');
        return res.redirect('/login');
    }
    next();
}

// passport now clears returnTo session var on login
//storing it as a local to use for redirect
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
