import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import OrderTrackingDetails from '../components/orders/OrderTrackingDetails';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingCancel, setLoadingCancel] = useState(null);
  const [trackingVisibleFor, setTrackingVisibleFor] = useState(null);

useEffect(() => {
  const fetchOrders = async () => {
    const token = user?.token || localStorage.getItem('token');
    console.log('🔐 Fetching orders with token:', token); // DEBUG

    try {
      const res = await axios.get('/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Error fetching orders');
    }
  };

  if (user) fetchOrders();
}, [user]);


  const getProductImage = (product) => {
    const path = product?.image || product?.imageUrl || product?.images?.[0];
    if (!path) return 'https://via.placeholder.com/80';
    return path.startsWith('http') ? path : `http://localhost:5000${path}`;
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setLoadingCancel(orderId);
      await axios.patch(`/api/orders/${orderId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${user?.token || localStorage.getItem('token')}`,
        },
      });
      setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to cancel the order.';
      alert(errorMsg);
    } finally {
      setLoadingCancel(null);
    }
  };

  const toggleTracking = (orderId) => {
    setTrackingVisibleFor(prev => prev === orderId ? null : orderId);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200"
            >
              <div className="mb-2 text-sm text-gray-700">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>

              <div className="flex flex-wrap gap-3 mt-3">
                {order.status === 'Pending' && (
                  <button
                    onClick={() => cancelOrder(order._id)}
                    disabled={loadingCancel === order._id}
                    className={`text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition ${
                      loadingCancel === order._id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loadingCancel === order._id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
                <button
                  onClick={() => toggleTracking(order._id)}
                  className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  {trackingVisibleFor === order._id ? 'Hide Tracking' : 'Track Order'}
                </button>
              </div>

              {trackingVisibleFor === order._id && (
                <div className="mt-4">
                  <OrderTrackingDetails orderId={order._id} />
                </div>
              )}

              <div className="flex flex-wrap gap-4 mt-4">
                {order.items?.map((item, index) => {
                  const product = item.product || {};
                  const key = item._id || `${order._id}-${index}`;
                  return (
                    <div key={key} className="w-32 text-center">
                      <img
                        src={getProductImage(product)}
                        alt={product.name || 'Product'}
                        className="w-20 h-20 object-cover rounded border border-gray-200 mx-auto"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/80')}
                      />
                      <div className="text-sm font-medium mt-2 text-gray-800">
                        {product.name || 'Unnamed Product'}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {product.description || 'No description'}
                      </div>
                      <div className="text-xs text-yellow-500 mt-1">
                        {product.ratingsAvg
                          ? `Rating: ${product.ratingsAvg.toFixed(1)} ⭐ (${product.ratingsCount || 0})`
                          : 'No ratings'}
                      </div>
                      <div className="text-sm font-semibold text-gray-700 mt-1">
                        ₹{product.price || '0'}
                      </div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
