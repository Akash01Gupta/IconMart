import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../api/orderApi';
import { Link } from 'react-router-dom';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load orders: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-6 text-gray-600">Loading orders...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📦 All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 shadow-sm rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left border">Order ID</th>
                <th className="px-4 py-3 text-left border">User</th>
                <th className="px-4 py-3 text-left border">Total Price</th>
                <th className="px-4 py-3 text-left border">Status</th>
                <th className="px-4 py-3 text-left border">Placed At</th>
                <th className="px-4 py-3 text-left border">Details</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-3 border">{order._id}</td>
                  <td className="px-4 py-3 border">
                    {order.user?.name} <br />
                    <span className="text-gray-500 text-xs">{order.user?.email}</span>
                  </td>
                  <td className="px-4 py-3 border font-medium">
                    ₹{order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-700'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 border text-sm">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 border">
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
