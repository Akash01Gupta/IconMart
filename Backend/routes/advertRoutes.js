const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlerware/authMiddleware');
const advertController = require('../controllers/advertController');
const multer = require('multer');
const { storage } = require('../config/cloudConfig');
const upload = multer({ storage });

router.get('/', advertController.getActiveAdvertisement);

router.put('/', protect, authorizeRoles('admin'), upload.single('image'), advertController.upsertAdvertisement);

module.exports = router
