import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../../api/orderApi';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    getOrderById(id)
      .then((res) => {
        setOrder(res.data);
        setStatus(res.data.status || 'Pending');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load order details');
        setLoading(false);
      });
  }, [id]);

  const handleStatusChange = (e) => setStatus(e.target.value);

  const handleUpdateStatus = async () => {
    setUpdatingStatus(true);
    try {
      await updateOrderStatus(id, status);
      alert('✅ Order status updated!');
    } catch {
      alert('❌ Failed to update status');
    }
    setUpdatingStatus(false);
  };

  if (loading) return <p className="text-center text-gray-500 mt-6">Loading order details...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
  if (!order) return <p className="text-center text-gray-500 mt-6">No order found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b pb-2">
        🧾 Order Details - <span className="text-gray-700">{order._id}</span>
      </h2>

      {/* User Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">👤 User Info</h3>
        <p className="text-gray-600">{order.user?.name} ({order.user?.email})</p>
      </div>

      {/* Shipping Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">📦 Shipping Address</h3>
        <div className="text-gray-600 space-y-1">
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
          <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
          <p>📞 {order.shippingAddress.phone}</p>
        </div>
      </div>

      {/* Items List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">🛒 Ordered Items</h3>
        <ul className="space-y-2 text-gray-700 text-sm">
          {order.items.map((item, index) => (
            <li key={index} className="flex justify-between border-b py-2">
              <span><span className="font-medium">Product ID:</span> {item.product}</span>
              <span><span className="font-medium">Qty:</span> {item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">💳 Payment Method</h3>
        <p className="text-gray-600">{order.paymentMethod}</p>
      </div>

      {/* Price Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">💰 Price Summary</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex justify-between p-3 bg-gray-50 text-sm">
            <span>Items Price</span>
            <span className="font-medium">₹{order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between p-3 text-sm">
            <span>Tax</span>
            <span className="font-medium">₹{order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 text-sm">
            <span>Shipping</span>
            <span className="font-medium">₹{order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between p-4 bg-green-50 text-green-800 text-lg font-bold">
            <span>Total</span>
            <span>₹{order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Status Update */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">📈 Update Status</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={updatingStatus}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            onClick={handleUpdateStatus}
            disabled={updatingStatus}
            className={`px-5 py-2 rounded-md font-medium text-white transition ${
              updatingStatus
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {updatingStatus ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}
