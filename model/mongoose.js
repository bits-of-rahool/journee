const mongoose = require('mongoose');
const User = require('./Users');


module.exports = createUser = async (username,email,password,callback) => { 
    const newUser = new User ({
        username: username,
        password: password,
        email: email,
      }); 

      await newUser.save();

        callback();

 };

