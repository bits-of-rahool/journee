import { User } from "../models/User.js";
import wrapper from "../utils/wrapper.js";

const verifyUser = wrapper(async (req, res, next) => {
    const found = await User.findOne({ username: req.body.username });

    if (!found) {
      throw new Error("User not found");
    }
    const isPasswordMatch = await found.comparePassword(req.body.password);

    if (isPasswordMatch) {
      res.redirect("/");
    } else {
      console.log("passn't");
      res.redirect("/user/login");
    }
})

export default verifyUser