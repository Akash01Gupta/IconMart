const express = require('express');
const {
  getCartItems,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  deleteCartItemAsAdmin,
  updateCartItemAsAdmin
} = require('../controllers/cartController.js');

const { protect, authorizeRoles } = require('../middlerware/authMiddleware.js');

const router = express.Router();

// ========== USER ROUTES ==========
router.get('/', protect, getCartItems);
router.post('/add/:productId', protect, addCartItem);
router.put('/:itemId', protect, updateCartItem); // update quantity
router.delete('/:itemId', protect, deleteCartItem);

// ========== ADMIN ROUTES ==========
router.put('/:userId/:itemId', protect, authorizeRoles('admin'), updateCartItemAsAdmin);
router.delete('/:userId/:itemId', protect, authorizeRoles('admin'), deleteCartItemAsAdmin);

module.exports = router;
