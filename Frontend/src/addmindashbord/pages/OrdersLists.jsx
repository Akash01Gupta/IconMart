import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../api/orderApi';
import { Link } from 'react-router-dom';

export default function OrderList() {
  const [ordersByUser, setOrdersByUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllOrders()
      .then((orders) => {
        if (Array.isArray(orders)) {
          const grouped = orders.reduce((acc, order) => {
            const userId = order.user?._id || 'Unknown';
            if (!acc[userId]) {
              acc[userId] = {
                user: order.user || { name: 'Unknown', email: 'N/A' },
                orders: [],
              };
            }
            acc[userId].orders.push(order);
            return acc;
          }, {});
          setOrdersByUser(grouped);
        } else {
          setError('Orders data is not an array');
        }
      })
      .catch((err) => {
        const message =
          err.response?.status === 403
            ? 'Unauthorized: Admin access required'
            : err.response?.data?.message || err.message;
        setError('Failed to load orders: ' + message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const statusColors = {
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
    Pending: 'bg-yellow-100 text-yellow-700',
  };

  const userEntries = Object.entries(ordersByUser);

  if (loading) return <p className="text-center mt-10 text-lg text-gray-600 animate-pulse">🔄 Loading orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-600 font-medium">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-12">
        📊 Orders Grouped by User
      </h1>

      {userEntries.map(([userId, { user, orders }], index) => (
        <div key={userId} className="mb-16 bg-white p-6 rounded-xl shadow-lg">
          {/* User Header */}
          <div className="mb-6 border-b pb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              👤 {user.name || 'Unknown User'}
              <span className="ml-2 text-sm text-gray-500">({user.email})</span>
            </h2>
            <p className="text-sm text-gray-500">Total Orders: {orders.length}</p>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left border-b">Order ID</th>
                  <th className="px-4 py-3 text-left border-b">Total</th>
                  <th className="px-4 py-3 text-left border-b">Status</th>
                  <th className="px-4 py-3 text-left border-b">Placed At</th>
                  <th className="px-4 py-3 text-left border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-blue-50 transition">
                      <td className="px-4 py-3 font-mono text-xs text-gray-800 border-t">
                        {order._id}
                      </td>
                      <td className="px-4 py-3 text-green-700 font-bold border-t">
                        ₹{order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 border-t">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-200 text-gray-800'}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 border-t">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 border-t">
                        <Link
                          to={`/admin/adminorderdetail/${order._id}/status`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                    {/* Product List */}
                    <tr className="bg-gray-50 text-gray-600 italic">
                      <td colSpan="5" className="px-4 py-2 text-sm border-b">
                        🛍 Products: {order.items.map(i => i.product?.name || '[Deleted]').join(', ')}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Divider */}
          {index < userEntries.length - 1 && (
            <div className="mt-8">
              <hr className="border-t-2 border-dashed border-gray-300" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
