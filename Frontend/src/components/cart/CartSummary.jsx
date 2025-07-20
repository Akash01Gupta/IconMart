import React from 'react';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';

const CartSummary = () => {
  const { cartItems, updateItem, removeItem } = useCart();

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🛒 Cart Summary
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center py-12 text-lg">
            Your cart is currently empty.
          </p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdate={updateItem}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CartSummary;
