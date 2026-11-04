const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyAdmin } = require('../middleware/auth');
const { isCloudinaryConfigured, uploadBufferToCloudinary } = require('../config/cloudinary');

/**
 * @route   POST /api/upload
 * @desc    Upload product image directly to Cloudinary CDN
 * @access  Protected (Admin only)
 */
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    if (!isCloudinaryConfigured) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary is not configured. Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.'
      });
    }

    // Stream buffer directly to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(req.file.buffer, 'lailashamsi_products');

    return res.status(200).json({
      success: true,
      message: 'Image uploaded to Cloudinary successfully!',
      imageUrl: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      format: cloudinaryResult.format,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Cloudinary image upload failed',
      error: error.message
    });
  }
});

module.exports = router;
