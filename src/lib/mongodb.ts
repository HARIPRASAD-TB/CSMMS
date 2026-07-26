import mongoose from "mongoose";

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing. Add it to .env.local (see .env.local.example)"
    );
  }
  return uri;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

async function connectMongo(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = getMongoUri();
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/**
 * Connect to MongoDB and auto-create collections + seed data on first run.
 */
export async function connectDB(): Promise<typeof mongoose> {
  const conn = await connectMongo();
  const { runDatabaseSetup } = await import("@/lib/init-database");
  await runDatabaseSetup();
  return conn;
}

export function getDatabaseName(): string {
  return mongoose.connection.db?.databaseName ?? "buildconnect";
}
