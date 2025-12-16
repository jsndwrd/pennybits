import mongoose from "mongoose";

export async function connectDb() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("Missing MONGODB_URI");

  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(mongoUri);
}

