if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.SECRET);
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
// session for flashing messages and user auth
const session = require('express-session');
const flash = require('connect-flash');
const CatchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

//? ROUTE REQUIREMENTS
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users.js');

// USE 127.0.0.1 INSTEAD OF LOCALHOST
mongoose.connect('mongodb://127.0.0.1:27017/yelpCampDb')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("Error, MONGO CONNECTION!!!!")
        console.log(err)
    })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("DB Connected");
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// allows express to parse request bodies into values
app.use(express.urlencoded({ extended: true }))
// use method override
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 6.048e+8,
        maxAge: 6.048e+8
    }
}
app.use(session(sessionConfig));
app.use(flash());

// passport use statements
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

// store user in session
passport.serializeUser(User.serializeUser())
// remove user from session
passport.deserializeUser(User.deserializeUser())

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000 SAH!!!')
})


//! locals, but more like globals
//! have access to them in every template/ejs file (e.g navbar, show)
app.use(function (req, res, next) {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.deleted = req.flash('deleted');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'saifA.uddin@proton.me', username: 'SexualChocolate' })
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})

//? USING ROUTES
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// HOME PAGE
app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

// BASIC ERROR HANDLER
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'something went wrong' } = err;
    if (!err.message) {
        err.message = "Oopsie! Error :("
    }
    res.status(statusCode).render('error', { err });
})

