import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: CachedConnection;
};

const cached = globalWithMongoose.mongooseCache ?? { conn: null, promise: null };
globalWithMongoose.mongooseCache = cached;

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

  cached.promise ??= mongoose.connect(MONGODB_URI, {
    dbName: "careernext"
  });

  cached.conn = await cached.promise;
  return cached.conn;
}
