const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

/**
 * @route   GET /api/admin/setup-status
 * @desc    Check whether the initial admin has been created in online database
 * @access  Public
 */
router.get('/setup-status', adminController.getSetupStatus);

/**
 * @route   POST /api/admin/register
 * @desc    One-time Master Admin Registration into Online Database
 * @access  Public (One-time only)
 */
router.post('/register', adminController.registerAdmin);

/**
 * @route   POST /api/admin/login
 * @desc    Admin authentication & token generation
 * @access  Public
 */
router.post('/login', adminController.loginAdmin);

/**
 * @route   GET /api/admin/me
 * @desc    Get current authenticated admin info
 * @access  Protected
 */
router.get('/me', verifyAdmin, adminController.getAdminProfile);

/**
 * @route   GET /api/admin/stats
 * @desc    Get executive dashboard metrics & summary
 * @access  Protected
 */
router.get('/stats', verifyAdmin, adminController.getAdminStats);

module.exports = router;
