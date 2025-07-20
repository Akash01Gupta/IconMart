import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartItems } from '../../api/cartApi';
import { createOrder } from '../../api/orderApi';
import Loader from '../common/Loader';
import Select from 'react-select';
import jsPDF from 'jspdf';
import {
  FaMoneyBillAlt, FaCreditCard, FaGooglePay,
  FaPhone, FaUniversity, FaWallet,
} from 'react-icons/fa';

const paymentOptions = [
  { value: 'Cash on Delivery', label: <div className="flex items-center gap-2"><FaMoneyBillAlt className="text-green-600" /> Cash on Delivery</div> },
  { value: 'Online Payment', label: <div className="flex items-center gap-2"><FaWallet className="text-blue-600" /> Online Payment</div> },
  { value: 'Google Pay', label: <div className="flex items-center gap-2"><FaGooglePay className="text-purple-600" /> Google Pay</div> },
  { value: 'PhonePe', label: <div className="flex items-center gap-2"><FaPhone className="text-indigo-600" /> PhonePe</div> },
  { value: 'UPI', label: <div className="flex items-center gap-2"><FaUniversity className="text-orange-600" /> UPI</div> },
  { value: 'Credit Card', label: <div className="flex items-center gap-2"><FaCreditCard className="text-gray-600" /> Credit/Debit Card</div> },
];

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '', phone: '', address: '', city: '',
    postalCode: '', country: ''
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentOptions[0]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartItems();
        const validItems = (Array.isArray(data) ? data : []).filter(item => item?.product);
        setCartItems(validItems);
      } catch (err) {
        console.error('Failed to load cart:', err);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const savedAddress = JSON.parse(localStorage.getItem('shippingAddress'));
    if (savedAddress) setShippingInfo(savedAddress);
  }, []);

  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingInfo));
  }, [shippingInfo]);

  const itemsPrice = cartItems.reduce((sum, item) =>
    sum + item.quantity * (item.product?.price || 0), 0);
  const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
  const shippingPrice = 50;
  const totalPrice = Number((itemsPrice + taxPrice + shippingPrice - discount).toFixed(2));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const applyCoupon = () => {
    if (couponCode === 'SAVE10') {
      setDiscount(0.1 * itemsPrice);
    } else {
      alert('Invalid coupon');
      setDiscount(0);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Order Summary', 20, 20);

    cartItems.forEach((item, index) => {
      doc.setFontSize(12);
      doc.text(
        `${index + 1}. ${item.product?.name} - Qty: ${item.quantity} - ₹${item.product?.price}`,
        20,
        30 + index * 10
      );
    });

    doc.text(`\nItems Price: ₹${itemsPrice}`, 20, 30 + cartItems.length * 10 + 10);
    doc.text(`Tax: ₹${taxPrice}`, 20, 30 + cartItems.length * 10 + 20);
    doc.text(`Shipping: ₹${shippingPrice}`, 20, 30 + cartItems.length * 10 + 30);
    doc.text(`Discount: ₹${discount}`, 20, 30 + cartItems.length * 10 + 40);
    doc.text(`Total: ₹${totalPrice}`, 20, 30 + cartItems.length * 10 + 50);

    doc.save('order-summary.pdf');
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress: shippingInfo,
        paymentMethod: selectedPaymentMethod.value,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };
      await createOrder(orderData);
      navigate('/order-success');
    } catch (error) {
      console.error('Order creation failed:', error.response?.data || error.message);
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Cart Summary</h3>
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">{item.product?.name || 'Unnamed Product'}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-700">
                  ₹{(item.quantity * (item.product?.price || 0)).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="border p-2 rounded w-full"
              />
              <button onClick={applyCoupon} className="bg-blue-500 text-white px-4 rounded">
                Apply
              </button>
            </div>
            <div className="mt-4 text-sm divide-y divide-gray-200 border rounded-lg overflow-hidden">
              <div className="flex justify-between px-4 py-3 bg-gray-50">
                <span className="text-gray-700 font-medium">Items Total</span>
                <span className="font-semibold text-gray-800">₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between px-4 py-3 bg-white">
                <span className="text-gray-700 font-medium">Tax (10%)</span>
                <span className="font-semibold text-gray-800">₹{taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between px-4 py-3 bg-gray-50">
                <span className="text-gray-700 font-medium">Shipping</span>
                <span className="font-semibold text-gray-800">₹{shippingPrice.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between px-4 py-3 bg-white text-green-600">
                  <span>Coupon Discount</span>
                  <span>- ₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between px-4 py-4 bg-white">
                <span className="text-lg font-semibold text-black">Total</span>
                <span className="text-lg font-bold text-green-600">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="px-4 py-3 text-right">
                <button
                  onClick={generatePDF}
                  className="ml-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Download Summary
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Shipping Information</h3>
              <form className="space-y-3">
                {[
                  { name: 'fullName', placeholder: 'Full Name' },
                  { name: 'phone', placeholder: 'Phone' },
                  { name: 'address', placeholder: 'Address' },
                  { name: 'city', placeholder: 'City' },
                  { name: 'postalCode', placeholder: 'Postal Code' },
                  { name: 'country', placeholder: 'Country' },
                ].map((field) => (
                  <input
                    key={field.name}
                    type="text"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={shippingInfo[field.name]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                ))}
              </form>
            </div>

            <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Payment Method</h3>
              <Select
                value={selectedPaymentMethod}
                options={paymentOptions}
                onChange={setSelectedPaymentMethod}
                className="react-select-container"
                classNamePrefix="react-select"
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 6,
                  colors: {
                    ...theme.colors,
                    primary25: '#e0f2fe',
                    primary: '#2563eb',
                  },
                })}
              />
            </div>

            <div className="text-right">
              <button
                onClick={handlePlaceOrder}
                className="px-6 py-2 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;