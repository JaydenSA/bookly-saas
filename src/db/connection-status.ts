import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function dbConnectionStatus() {
  if (!process.env.MONGODB_URI) {
    return "No MONGODB_URI environment variable";
  }
  try {
    const conn = await connectDB();
    if (!conn) return "Database not connected";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = (mongoose.connection as any).db.admin();
    const result = await admin.command({ ping: 1 });
    console.log("MongoDB connection successful:", result);
    return "Database connected";
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return "Database not connected";
  }
}