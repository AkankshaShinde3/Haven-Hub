const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ //config means joining
    cloud_name: process.env.COUDE_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_AP_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ["png", "jpeg", "jpg"] // supports promises as well
    },
  });

module.exports = {
    cloudinary,
    storage,
}
