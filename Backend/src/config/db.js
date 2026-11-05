import mongoose from "mongoose";

let connectionPromise;

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

export default async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error("Missing MONGO_URI in environment variables.");
  }

  if (mongoose.connection.readyState === 1) return;
  if (connectionPromise) return connectionPromise;

  connectionPromise = mongoose
    .connect(mongoUri, { autoIndex: true })
    .then(() => undefined)
    .finally(() => {
      connectionPromise = undefined;
    });

  return connectionPromise;
}
