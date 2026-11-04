const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers to prevent Windows/local ISP SRV query refusals
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // Non-fatal if runtime restricts DNS configuration
}

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  // If connection is already established and open, reuse it immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If a connection is in-flight, await the ongoing promise to avoid race conditions
  if (mongoose.connection.readyState === 2 && connectionPromise) {
    try {
      await connectionPromise;
      return mongoose.connection;
    } catch {
      // Fall through to retry below
    }
  }

  if (Boolean(process.env.VERCEL) && !process.env.MONGODB_URI) {
    console.error('❌ CRITICAL VERCEL CONFIGURATION ERROR: MONGODB_URI is not set in Vercel Project Settings!');
    return null;
  }

  let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lailashamsi';

  // Automatically attach database name and standard options if trailing slash or empty path
  if (mongoUri.includes('mongodb.net') && (mongoUri.endsWith('.mongodb.net') || mongoUri.endsWith('.mongodb.net/'))) {
    mongoUri = mongoUri.replace(/\/?$/, '/lailashamsi?retryWrites=true&w=majority');
  }

  try {
    const isServerless = Boolean(process.env.VERCEL);
    
    connectionPromise = mongoose.connect(mongoUri, {
      maxPoolSize: isServerless ? 10 : 50, // 10 is recommended for serverless lambdas to prevent pool exhaustion on Atlas
      minPoolSize: isServerless ? 0 : 5,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });

    const conn = await connectionPromise;
    isConnected = true;
    console.log(`✅ MongoDB Connected to Atlas (${conn.connection.name}): ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnected = false;
    connectionPromise = null;
    console.warn(`⚠️ MongoDB Connection Notice (Running in resilient fallback mode): ${error.message}`);
    // Do NOT process.exit(1) so the API functions remain responsive with fallback catalogs
    return null;
  }
};

module.exports = connectDB;
