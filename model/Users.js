const mongoose = require('mongoose');

// Define the schema for the Users model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create the Users model using the schema
const User = new mongoose.model('User', userSchema);

module.exports = User;
