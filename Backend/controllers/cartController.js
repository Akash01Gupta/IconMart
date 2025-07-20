const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Get all cart items for the logged-in user
module.exports.getCartItems = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) return res.json({ items: [] });
    res.json(cart.items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add product to cart
module.exports.addCartItem = async (req, res) => {
  const productId = req.params.productId;
  const { quantity } = req.body;
  const userId = req.user.id;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Valid product ID and quantity required' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [{ product: productId, quantity }] });
    } else {
      const existingItem = cart.items.find(item => item.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    await cart.populate('items.product');
    res.status(200).json({ message: 'Cart updated', cart });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update quantity of a cart item for user
module.exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ error: 'Cart item not found' });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: 'Cart item updated', item });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a cart item for user
module.exports.deleteCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ error: 'Cart item not found' });

    item.deleteOne();
    await cart.save();

    res.json({ message: 'Cart item deleted by user' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ==================== ADMIN CONTROLLERS ====================

// Admin: Delete a cart item for any user
module.exports.deleteCartItemAsAdmin = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ error: 'Cart item not found' });

    item.deleteOne();
    await cart.save();

    res.json({ message: 'Cart item deleted by admin' });
  } catch (error) {
    console.error('Admin delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// // Admin: Update a cart item for any user
module.exports.updateCartItemAsAdmin = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ error: 'Cart item not found' });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: 'Cart item updated by admin', item });
  } catch (error) {
    console.error('Admin update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
