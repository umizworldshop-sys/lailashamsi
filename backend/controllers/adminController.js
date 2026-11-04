const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Order = require('../models/Order');
const connectDB = require('../config/db');

// Helper to generate secure JWT
const generateToken = (adminId) => {
  const secret = process.env.JWT_SECRET || 'laila_shamsi_super_secret_jwt_key_2026_ateliere';
  return jwt.sign({ id: adminId }, secret, { expiresIn: '7d' });
};

/**
 * Check whether the master admin exists in online database
 */
exports.getSetupStatus = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        dbConnected: false,
        hasAdmin: false,
        message: 'Online database connecting or offline. Defaulting to setup view.'
      });
    }

    const adminCount = await Admin.countDocuments();
    return res.status(200).json({
      success: true,
      dbConnected: true,
      hasAdmin: adminCount > 0,
      message: adminCount > 0 ? 'Admin exists. Please log in.' : 'No admin found. Setup required.'
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      dbConnected: false,
      hasAdmin: false,
      message: 'Could not query setup status: ' + error.message
    });
  }
};

/**
 * One-time Master Admin Registration into Online Database
 */
exports.registerAdmin = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Online database is connecting. Please verify your Atlas cluster connection.'
      });
    }

    const adminCount = await Admin.countDocuments();

    // STRICT CHECK: Admin can only be registered once
    if (adminCount > 0) {
      return res.status(403).json({
        success: false,
        message: 'Registration is permanently locked! Master admin already registered. Please login.'
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are all required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const newAdmin = new Admin({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    });

    await newAdmin.save();

    const token = generateToken(newAdmin._id);

    return res.status(201).json({
      success: true,
      message: 'Master Admin account created and saved in online database successfully!',
      token,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error saving admin to database'
    });
  }
};

/**
 * Master Admin Login
 */
exports.loginAdmin = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Online database is connecting. Please check your MongoDB Atlas status.'
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No admin account found with this email.'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    const token = generateToken(admin._id);

    return res.status(200).json({
      success: true,
      message: 'Welcome back to Laila Shamsi Atelier Admin Portal',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

/**
 * Get current authenticated admin info
 */
exports.getAdminProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: req.admin
  });
};

/**
 * Get dashboard statistics and metrics
 */
exports.getAdminStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue and breakdown by status
    const orders = await Order.find().sort({ createdAt: -1 });
    
    let totalRevenue = 0;
    let pendingOrders = 0;
    let processingOrders = 0;
    let shippedOrders = 0;
    let deliveredOrders = 0;

    orders.forEach(order => {
      totalRevenue += (order.grandTotal || 0);
      if (order.status === 'Pending') pendingOrders++;
      else if (order.status === 'Processing') processingOrders++;
      else if (order.status === 'Shipped') shippedOrders++;
      else if (order.status === 'Delivered') deliveredOrders++;
    });

    const recentOrders = orders.slice(0, 5);

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue),
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        recentOrders
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve stats',
      error: error.message
    });
  }
};

