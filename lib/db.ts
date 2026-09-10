import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_CONNECTION_STRING;

if (!MONGODB_URI) {
  throw new Error("Missing DB_CONNECTION_STRING in environment variables");
}

// Next.js hot-reloads modules in dev, which would otherwise open a new
// connection on every request. Cache the connection promise on the
// global object so it survives module reloads.
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}