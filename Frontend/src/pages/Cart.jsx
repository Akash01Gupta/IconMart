import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartItems } from '../api/cartApi';
import { useCart } from '../contexts/CartContext';
import Loader from '../components/common/Loader';
import CartItem from '../components/cart/CartItem';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { updateItem, removeItem } = useCart();

  useEffect(() => {
    const fetchCart = async () => {
      const data = await getCartItems();

      if (data?.unauthorized) {
        navigate('/login');
        return;
      }

      if (Array.isArray(data)) {
        setCartItems(data);
      } else if (data?.cart && Array.isArray(data.cart)) {
        setCartItems(data.cart);
      } else {
        setCartItems([]);
      }

      setLoading(false);
    };

    fetchCart();
  }, []);

  if (loading) return <Loader />;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * (item.product?.price || 0),
    0
  );

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <section className="px-4 py-10 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-2">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded shadow p-6 text-center text-gray-600 text-lg">
          Your cart is empty.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {cartItems.map((item) =>
            item.product ? (
              <CartItem
                key={item._id}
                item={item}
                onUpdate={updateItem}
                onRemove={removeItem}
              />
            ) : null
          )}

          {/* Cart Total and Checkout */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 border-t pt-6 border-gray-200 gap-6">
            <p className="text-xl font-semibold text-gray-800">
              Total: <span className="text-green-600">₹{totalPrice.toFixed(2)}</span>
            </p>
            <button
              onClick={handleCheckout}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-200"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
