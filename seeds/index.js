const mongoose = require('mongoose');
const path = require('path');

const cities = require('./cities');
const seedHelpers = require('./seedHelpers');
const Campground = require('../models/campground');

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
});

// clearing out db and re-filling it
const seedDB = async() => {
    // clearing db
    await Campground.deleteMany({});
    // generating 50 new campgrounds
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random()*1000);
        const randomDesc = Math.floor(Math.random()*20);
        const randomPlace = Math.floor(Math.random()*20);
        const camp = new Campground({
            title: `${seedHelpers.descriptors[randomDesc]} ${seedHelpers.places[randomPlace]}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        })
        await camp.save();
    }
}
// calling/executing seedDB, important step lmao
seedDB();