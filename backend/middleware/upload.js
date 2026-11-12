const multer = require('multer');

// Memory storage is serverless-ready (keeps file in RAM buffer for direct streaming to Cloudinary)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/avif', 'image/gif'];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP, AVIF, GIF) are permitted!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // Strict 1MB image limit
  fileFilter
});

module.exports = upload;
