import "server-only";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in env");

/**
 * In development & serverless, we must cache the connection promise so
 * we don’t create a new connection on every request or reload.
 */
let cached = (global as any)._mongoose;
if (!cached) {
  cached = (global as any)._mongoose = {
    conn: null as typeof mongoose | null,
    promise: null as Promise<typeof mongoose> | null,
  };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI ?? "");
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
