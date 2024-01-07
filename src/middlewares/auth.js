import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/User.js"
import dotenv from "dotenv"
dotenv.config()

const signUser = async (req, res, next) => {  
    const { username, password } = req.body;
    jwt.sign({ username, password }, process.env.SECRET_KEY, { expiresIn: "1h" }, (err, token) => {

    });   
}