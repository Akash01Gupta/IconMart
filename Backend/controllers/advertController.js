// controllers/advertController.js
const Advertisement = require('../models/Advertisement');
const multer = require('multer');
const { storage } = require('../config/cloudConfig');
const upload = multer({ storage });

exports.getActiveAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findOne({ active: true });
    if (!ad) return res.status(404).json({ message: 'No active advertisement found' });
    res.json(ad);
  } catch (err) {
    console.error('Get Ad Error:', err);
    res.status(500).json({ message: 'Failed to fetch advertisement' });
  }
};

exports.upsertAdvertisement = async (req, res) => {
  try {
    const { message, code, active } = req.body;
    const imageUrl = req.file ? req.file.path : undefined; // Cloudinary path

    let ad = await Advertisement.findOne();

    if (ad) {
      ad.message = message || ad.message;
      ad.code = code || ad.code;
      ad.active = active !== undefined ? active : ad.active;
      if (imageUrl) ad.imageUrl = imageUrl;
      await ad.save();
    } else {
      ad = await Advertisement.create({
        message,
        code,
        imageUrl,
        active,
      });
    }

    res.json(ad);
  } catch (err) {
    console.error('Update Ad Error:', err);
    res.status(500).json({ message: 'Failed to update advertisement' });
  }
};
