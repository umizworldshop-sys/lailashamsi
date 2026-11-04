const path = require('path');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

function ensureCloudinaryConfigured() {
  dotenv.config({ path: path.join(__dirname, '..', '.env'), override: true });

  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });
    return true;
  }
  return false;
}

ensureCloudinaryConfigured();

const uploadBufferToCloudinary = (fileBuffer, folder = 'lailashamsi_products') => {
  ensureCloudinaryConfigured();
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const uploadFileToCloudinary = async (fileOrDataUri, folder = 'lailashamsi_products') => {
  ensureCloudinaryConfigured();
  return await cloudinary.uploader.upload(fileOrDataUri, {
    folder,
    resource_type: 'image',
    transformation: [
      { quality: 'auto', fetch_format: 'auto' }
    ]
  });
};

const deleteFromCloudinary = async (publicIdOrUrl) => {
  if (!ensureCloudinaryConfigured() || !publicIdOrUrl) return null;
  let publicId = publicIdOrUrl;
  if (typeof publicIdOrUrl === 'string' && publicIdOrUrl.includes('cloudinary.com')) {
    const parts = publicIdOrUrl.split('/upload/');
    if (parts.length > 1) {
      const pathAfterUpload = parts[1].replace(/^v\d+\//, '');
      publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
    }
  }
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn(`⚠️ Cloudinary deletion notice for "${publicId}":`, err.message);
    return null;
  }
};

module.exports = {
  cloudinary,
  ensureCloudinaryConfigured,
  get isCloudinaryConfigured() {
    return ensureCloudinaryConfigured();
  },
  uploadBufferToCloudinary,
  uploadFileToCloudinary,
  deleteFromCloudinary
};
