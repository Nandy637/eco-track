import mongoose from 'mongoose'
import dns from 'dns'

// Ensure Node uses public resolvers if local router fails to resolve SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4'])
} catch (e) {}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecotrack'

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}
