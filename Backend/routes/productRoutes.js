const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  rateProduct,
  editReview,
  deleteReview,
} = require('../controllers/productController');

const multer = require('multer');
const { storage } = require('../config/cloudConfig');
const upload = multer({ storage });

const { protect, authorizeRoles } = require('../middlerware/authMiddleware');

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// User
router.post('/:id/rate', protect, rateProduct);
router.put('/:productId/reviews/:reviewId', protect, editReview);
router.delete('/:productId/reviews/:reviewId', protect, deleteReview);

// Admin
router.post('/', protect, authorizeRoles('admin'), upload.single('image'), createProduct);
router.put('/:id', protect, authorizeRoles('admin'), upload.single('image'), updateProduct);
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);

module.exports = router;
