import mongoose from "mongoose";
import { env } from "@/config/env";

export async function connectDB() {
  if (!env.MONGO_URI) throw new Error("MONGO_URI não foi definido");

  mongoose.connection.on("connected", () => console.log("🗃️  MongoDB connected"));
  mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));
  mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected"));

  await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
