import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  const startTime = new Date();
  console.log("establishing connection to database...");
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const endTime = new Date();
    console.log(
      `connected to database in ${
        endTime.getSeconds() - startTime.getSeconds()
      } seconds.`
    );
  } catch (error) {
    throw error;
  }
};

export default connectDB;
