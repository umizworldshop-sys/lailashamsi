const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers to prevent Windows/local ISP SRV query refusals
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // Non-fatal if runtime restricts DNS configuration
}

// Global cached connection for Serverless (Vercel Lambdas) & Node.js
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // 1. If connection is already open and ready, return it immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // 2. If a connection attempt is currently in-flight, await it
  if (cached.promise) {
    try {
      const conn = await cached.promise;
      if (mongoose.connection.readyState === 1) {
        cached.conn = conn;
        return conn;
      }
    } catch {
      cached.promise = null;
    }
  }

  let mongoUri = process.env.MONGODB_URI || 'mongodb+srv://umizworldshop_db_user:lailashamsi@cluster0.daspiqv.mongodb.net/lailashamsi?retryWrites=true&w=majority';

  // Automatically attach database name and standard options if trailing slash or empty path
  if (mongoUri.includes('mongodb.net') && (mongoUri.endsWith('.mongodb.net') || mongoUri.endsWith('.mongodb.net/'))) {
    mongoUri = mongoUri.replace(/\/?$/, '/lailashamsi?retryWrites=true&w=majority');
  }

  try {
    const isServerless = Boolean(process.env.VERCEL);
    
    cached.promise = mongoose.connect(mongoUri, {
      maxPoolSize: isServerless ? 10 : 30,
      minPoolSize: isServerless ? 0 : 2,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000
    }).then((m) => {
      cached.conn = m;
      console.log(`✅ MongoDB Connected to Atlas (${m.connection.name}): ${m.connection.host}`);
      return m;
    });

    const conn = await cached.promise;
    return conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.warn(`⚠️ MongoDB Connection Notice (Running in resilient fallback mode): ${error.message}`);
    return null;
  }
};

module.exports = connectDB;
