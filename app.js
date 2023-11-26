const express = require('express');
const app = express();
const path = require('path')
const Campground = require('./models/campground')

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

// HOME PAGE
app.get('/', (req, res) => {
    res.render('home')
})

// NEW CAMPGROUND
app.get('/makecampground', async (req, res)=> {
    const camp = new Campground({title: 'My Backyard'});
    await camp.save();
    res.send(camp)
})

app.listen(3000, ()=> {
    console.log('LISTENING ON PORT 3000 SAH!!!')
})