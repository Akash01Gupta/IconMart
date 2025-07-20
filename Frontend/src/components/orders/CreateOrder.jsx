import React, { useState } from 'react';
import { createOrder } from '../api/orderApi';

export default function CreateOrder() {
  const [formData, setFormData] = useState({
    items: [{ productId: '', quantity: 1 }],
    shippingAddress: '',
    paymentMethod: '',
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
  });
  const [message, setMessage] = useState('');

  const handleChange = (e, index, field) => {
    if (field === 'items') {
      const itemsCopy = [...formData.items];
      itemsCopy[index][e.target.name] = e.target.value;
      setFormData({ ...formData, items: itemsCopy });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { productId: '', quantity: 1 }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderPayload = {
        items: formData.items.map(i => ({
          product: i.productId,
          quantity: Number(i.quantity),
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        itemsPrice: Number(formData.itemsPrice),
        taxPrice: Number(formData.taxPrice),
        shippingPrice: Number(formData.shippingPrice),
        totalPrice: Number(formData.totalPrice),
      };

      const res = await createOrder(orderPayload);
      setMessage(`✅ Order created with ID: ${res.data._id}`);
    } catch (err) {
      setMessage('❌ Error creating order: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">📦 Create Order</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">🛒 Order Items</h3>
          {formData.items.map((item, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="productId"
                placeholder="Product ID"
                value={item.productId}
                onChange={(e) => handleChange(e, i, 'items')}
                required
                className="input"
              />
              <input
                type="number"
                name="quantity"
                min="1"
                value={item.quantity}
                onChange={(e) => handleChange(e, i, 'items')}
                required
                className="input"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-blue-600 hover:underline text-sm"
          >
            ➕ Add Item
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="shippingAddress"
            placeholder="Shipping Address"
            value={formData.shippingAddress}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="paymentMethod"
            placeholder="Payment Method"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="itemsPrice"
            type="number"
            placeholder="Items Price"
            value={formData.itemsPrice}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="taxPrice"
            type="number"
            placeholder="Tax Price"
            value={formData.taxPrice}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="shippingPrice"
            type="number"
            placeholder="Shipping Price"
            value={formData.shippingPrice}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="totalPrice"
            type="number"
            placeholder="Total Price"
            value={formData.totalPrice}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition"
          >
            ✅ Create Order
          </button>
        </div>
      </form>

      {message && (
        <p className="mt-4 text-center font-medium text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}
