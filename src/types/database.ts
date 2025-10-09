// Database-related types and interfaces

import mongoose from 'mongoose';

export type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  sampleConn: mongoose.Connection | null;
  samplePromise: Promise<mongoose.Connection> | null;
};
