import mongoose from "mongoose";

export default async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error("Missing MONGO_URI in environment variables.");
  }

  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB disconnected");
  });

  await mongoose.connect(mongoUri, {
    autoIndex: true,
  });
}
