import { User } from "../models/User.js";
import wrapper from "../utils/wrapper.js";
import ApiError from "../utils/ApiError.js";

const generateRefreshAndAccessToken = async (user) => {
  // const user = await User.findById(id);
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    const updatedUser =await user.save();
    
  return { accessToken, refreshToken, updatedUser };
  } catch (error) {
    throw new ApiError(500, error.message);
  }

}


const createUser = wrapper (async (req,res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });


    return await newUser.save().then(() => {
      res.redirect("/user/login");
    }).catch((err) => {
      throw new ApiError(err.statusCode, err.message );
    });
});


const loginUser = wrapper(async (req, res, next) => {
  const {username, password,email} = req.body;
  const user = await User.findOne({ $or:[{username},{email}] });
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Password is incorrect");
  } 

  const {accessToken,updatedUser,refreshToken}= await generateRefreshAndAccessToken(user);
  // console.log(accessToken);
  const options = {
  secure: true,
    httpOnly: true,
  };

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json({
    accessToken,
    refreshToken,
    updatedUser,
  })
})

export  {createUser, loginUser};
