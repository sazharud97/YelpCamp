const mongoose = require('mongoose');
const path = require('path');

const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
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
db.once("open", () => {
    console.log("DB Connected");
});

// picks a random value from the array passed to it as a param
// e.g sample(places) picks a raondom value from places array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// clearing out db and re-filling it
const seedDB = async () => {
    // clearing db
    await Campground.deleteMany({});
    // generating 50 new campgrounds
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '66672380d54b82c7ed02f25c',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque sed assumenda animi, iure dolore facilis sapiente vitae doloribus? Inventore aperiam in officia ullam provident modi qui quos ea, adipisci unde.",
            price: `${(Math.floor(Math.random() * 20) + 10).toString()}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dcryxnir5/image/upload/v1720773105/YelpCamp/g16c8aknpvlvumlla0gj.jpg',
                    filename: 'YelpCamp/g16c8aknpvlvumlla0gj'
                },
                {
                    url: 'https://res.cloudinary.com/dcryxnir5/image/upload/v1720773105/YelpCamp/ubpatcqh7ag8pfakhlbg.jpg',
                    filename: 'YelpCamp/ubpatcqh7ag8pfakhlbg'
                }
            ]
        })
        await camp.save();
    }
}
// calling/executing seedDB, important step lmao
// close db connection after seeding
seedDB().then(() => { mongoose.connection.close() });