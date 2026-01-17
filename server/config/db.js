import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

export async function connectDB() {
  if (mongoose.connection.readyState !== 0) return; // already connected
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB Atlas connected");
}
