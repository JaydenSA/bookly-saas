import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const SAMPLE_MFLIX_URI = process.env.SAMPLE_MFLIX_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined. Please check your .env.local file');
} else {
  // console.log('MONGODB_URI is defined:', MONGODB_URI.substring(0, 20) + '...');
  console.log('MONGODB_URI is defined:', MONGODB_URI);
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  sampleConn: mongoose.Connection | null;
  samplePromise: Promise<mongoose.Connection> | null;
};

declare global {
  var mongoose: MongooseCache | undefined;
}

const globalForMongoose = globalThis as unknown as { mongoose: MongooseCache | undefined };

if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = {
    conn: null,
    promise: null,
    sampleConn: null,
    samplePromise: null,
  };
}

const cached: MongooseCache = globalForMongoose.mongoose as MongooseCache;

async function connectDB() {
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI is not defined. Database features will be disabled.');
    return null;
  }

  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new MongoDB connection...');
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Failed to connect to MongoDB:', e);
    return null;
  }

  return cached.conn;
}

async function connectSampleDB() {
  if (!SAMPLE_MFLIX_URI) {
    console.warn('SAMPLE_MFLIX_URI is not defined. Sample data features will be disabled.');
    return null;
  }

  if (cached.sampleConn) {
    return cached.sampleConn;
  }

  if (!cached.samplePromise) {
    const opts = {
      bufferCommands: false,
    };

    const conn = mongoose.createConnection(SAMPLE_MFLIX_URI, opts);
    cached.samplePromise = conn.asPromise().then(() => conn);
  }

  try {
    cached.sampleConn = await cached.samplePromise;
  } catch (e) {
    cached.samplePromise = null;
    console.error('Failed to connect to sample database:', e);
    return null;
  }

  return cached.sampleConn;
}

// Export default for backward compatibility with auth
export default connectDB;
// Export named functions for sample database
export { connectDB, connectSampleDB }; 