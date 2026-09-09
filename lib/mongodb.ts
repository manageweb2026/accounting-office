import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI n'est pas défini dans .env.local");
}

const mongoUri: string = uri;

const mongoOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
};

/* =========================================
   MongoDB Native Client
   يستخدمه Better Auth
========================================= */

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(mongoUri, mongoOptions);

    globalForMongo.mongoClientPromise = client.connect();
  }

  clientPromise = globalForMongo.mongoClientPromise;
} else {
  const client = new MongoClient(mongoUri, mongoOptions);

  clientPromise = client.connect();
}

export { clientPromise };

/* =========================================
   Mongoose
   يستخدمه باقي المشروع
========================================= */

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  await mongoose.connect(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

  return mongoose.connection;
}

export default dbConnect;