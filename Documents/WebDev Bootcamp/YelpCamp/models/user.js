const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: { type: String, required: true }
});

// Adds username/pass to schema and makes passport validation tools available
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);