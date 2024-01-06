import mongoose from "mongoose";

// Define the schema for the Users model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create the Users model using the schema

export default mongoose.model("User", userSchema);
