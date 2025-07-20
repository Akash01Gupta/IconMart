import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  addToCartAPI,
  getCartItems,
  updateCartItem as updateCartItemAPI,
  removeCartItem,
} from '../api/cartApi';
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const data = await getCartItems();
      if (Array.isArray(data)) {
        setCartItems(data);
      } else if (data && Array.isArray(data.cart)) {
        setCartItems(data.cart);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Failed to load cart items:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      await addToCartAPI(productId, quantity, token);
      await fetchCart();
    } catch (err) {
      console.error('Add item error:', err.message);
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const updated = await updateCartItemAPI(itemId, quantity);
      // Update local state
      setCartItems(prev =>
        prev.map(item =>
          item._id === itemId ? { ...item, quantity: updated.item.quantity } : item
        )
      );
    } catch (error) {
      console.error("Update cart item failed:", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const data = await removeCartItem(itemId);
      // Assuming backend returns updated items array in data.items
      setCartItems(data.items || []);  
    } catch (err) {
      console.error('Remove item error:', err.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        setLoading,
        addItem,
        updateItem,
        removeItem,
        fetchCart,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
