const mongoose = require('mongoose');
const path = require('path');

const Campground = require('./models/campground');

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
    await Campground.deleteMany({});
    const c = new Campground({title: 'purple field'});
    await c.save();
}