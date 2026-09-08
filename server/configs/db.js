import mongoose from "mongoose";

const connectDB = async () => {
  try {
    
    mongoose.connection.on("connected",()=>
    console.log("MongoDB connected"))
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("MongoDB Error:");
    console.error(error);
  }
};

export default connectDB;