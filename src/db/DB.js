import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`Connected to DB: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("ERROR - DB bla vla", error);
    throw error;
  }
};

export default connectDB;
