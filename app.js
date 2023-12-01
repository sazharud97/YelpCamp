const express = require('express');
const mongoose = require('mongoose');

const Campground = require('./models/campground');

const app = express();
const path = require('path');

// USE 127.0.0.1 INSTEAD OF LOCALHOST
mongoose.connect('mongodb://127.0.0.1:27017/yelpCampDb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("Error, MONGO CONNECTION!!!!")
        console.log(err)
    })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", ()=> {
    console.log("DB Connected");
})

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

// HOME PAGE
app.get('/', (req, res) => {
    res.render('home')
})

// GET CAMPGROUNDS
app.get('/campgrounds', async(req, res) => {
    const campgrounds = await (Campground.find({}));
    res.render('campgrounds/index', {campgrounds})
})

// NEW CAMPGROUND
app.get('/makecampground', async (req, res)=> {
    const camp = new Campground({title: 'My Backyard', description: 'Issa my backyard sah'});
    await camp.save();
    res.send(camp)
})

app.listen(3000, ()=> {
    console.log('LISTENING ON PORT 3000 SAH!!!')
})