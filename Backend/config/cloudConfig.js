const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'uploads';
    if (req.baseUrl.includes('advert')) folder = 'advertisements';
    else if (req.baseUrl.includes('products')) folder = 'products';
    else if (req.baseUrl.includes('profile')) folder = 'profileImages';

    return {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: `image-${Date.now()}`,
    };
  },
});

module.exports = { cloudinary, storage };
