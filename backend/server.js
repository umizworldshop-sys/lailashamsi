const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
const http = require('http');
const os = require('os');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Models & Seed Data
const Product = require('./models/Product');
const initialProducts = require('./data/initialProducts');

// Routes
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and seed catalog if empty
const initDB = async () => {
  try {
    const conn = await connectDB();
    if (!conn) return;

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('📦 Seeding initial products into database...');
      await Product.insertMany(initialProducts);
      console.log('✅ Initial products catalog seeded successfully!');
    }
  } catch (err) {
    console.warn('⚠️ Notice: Could not complete initial DB seed check:', err.message);
  }
};

// Initiate DB connection asynchronously
initDB();

// Middleware to ensure DB connection is ready on serverless warm/cold calls
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch {
    // Resilient fallback handles queries if DB is offline
  }
  next();
});

// High-Performance Middleware
app.disable('x-powered-by');

// Production CORS Configuration
const allowedOrigins = [
  'https://www.lailashamsi.com',
  'https://lailashamsi.com',
  'https://lailashamsi-frn21.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN
].filter(Boolean).map(url => url.replace(/\/+$/, ''));

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server health checks)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/+$/, '');

    // Allow development, wildcard, explicit whitelist, or any Vercel domain / production domain
    if (
      process.env.NODE_ENV !== 'production' ||
      allowedOrigins.includes('*') ||
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.includes('lailashamsi.com')
    ) {
      return callback(null, true);
    }

    console.warn(`⚠️ CORS blocked request from unauthorized origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded static files with browser caching headers
const uploadsPath = process.env.VERCEL
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsPath)) {
  try {
    fs.mkdirSync(uploadsPath, { recursive: true });
  } catch {
    // Read-only filesystem warning handled gracefully
  }
}

app.use('/uploads', express.static(uploadsPath, {
  maxAge: '7d',
  etag: true
}));

// Root endpoint for deployment verification
app.get('/', (req, res) => {
  res.json({
    name: "Umi'z World Atelier API",
    status: 'online',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    serverless: Boolean(process.env.VERCEL),
    health: '/api/health',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      orders: '/api/orders',
      settings: '/api/settings',
      admin: '/api/admin'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.redirect('/api/health');
});

// Health check with diagnostics
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    concurrencyMode: 'high-throughput',
    environment: process.env.NODE_ENV || 'development',
    serverless: Boolean(process.env.VERCEL),
    message: "Umi'z World Atelier API is active and running",
    timestamp: new Date().toISOString()
  });
});

// Mount Routes (supporting both /api/ prefix and direct path for maximum Vercel rewrite compatibility)
app.use(['/api/admin', '/admin'], adminRoutes);
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/upload', '/upload'], uploadRoutes);
app.use(['/api/settings', '/settings'], settingsRoutes);

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack || err.message);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Crash-Prevention Guards
process.on('uncaughtException', (err) => {
  console.error('⚠️ Caught Uncaught Exception (Server kept alive):', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Caught Unhandled Rejection (Server kept alive):', reason);
});

// Export app for serverless platforms (e.g. Vercel Functions)
module.exports = app;

// Create HTTP server only for standalone Node environments (local development, Docker, Render, etc.)
if (!process.env.VERCEL && require.main === module) {
  const server = http.createServer(app);
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;
  server.maxConnections = 5000;

  server.listen(PORT, () => {
    console.log(`🚀 Laila Shamsi High-Concurrency Server running at http://localhost:${PORT}`);
  });
}
