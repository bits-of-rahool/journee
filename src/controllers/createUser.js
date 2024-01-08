import { User } from "../models/User.js";
import wrapper from "../utils/wrapper.js";

const createUser = wrapper (async (req,res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });
    return await newUser.save().then(() => {
      res.redirect("/user/login");
    });
});
export default createUser;
