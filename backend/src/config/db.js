import mongoose from "mongoose";
import "dotenv/config";

const dbURI = process.env.MONGODB_URI;
const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export { connectToDatabase };
