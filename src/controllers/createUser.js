import {User} from "../models/User.js";

const createUser = async (username, email, password, callback) => {
  const newUser = new User({
    username: username,
    password: password,
    email: email,
  });
  try {
    const res = await newUser.save();
    callback();
  } catch (err) {
    console.log("in create user")
    callback(err);
  }
};

export default createUser;
