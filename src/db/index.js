import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected To Database`);
  } catch (error) {
    console.log(`Error in connecting to DB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
 