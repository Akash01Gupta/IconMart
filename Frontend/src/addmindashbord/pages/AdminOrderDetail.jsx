import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import OrderStatusUpdate from '../OrderDetails/OrderStatusUpdate';

const AdminOrderDetail = () => {
  const { id, subpage } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch order');
        setOrder(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOrder();
  }, [id, token]);

  if (!id) return (
    <div className="text-center mt-10">
      <p className="text-red-600 text-lg font-medium">❌ Order ID is missing in the URL.</p>
    </div>
  );

  if (error) return (
    <div className="text-center mt-10">
      <p className="text-red-600 text-lg font-medium">❌ {error}</p>
    </div>
  );

  if (!order) return (
    <div className="text-center mt-10">
      <p className="text-gray-600 text-lg">Loading order details...</p>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-100 mt-10 transition-all duration-300">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 border-b pb-2">📦 Admin Order Details</h1>

      <div className="mb-6">
        <p className="text-gray-500 mb-1 text-sm">Order ID</p>
        <p className="font-mono text-lg text-gray-800 bg-gray-100 p-2 rounded-md">{id}</p>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-gray-500 text-sm">Status</p>
          <p className="text-lg font-semibold text-green-600 capitalize">
            {order.status || 'Pending'}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Customer</p>
          <p className="text-lg text-gray-700">{order.user?.name || 'N/A'}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Total Amount</p>
          <p className="text-lg font-medium text-black">₹{order.totalPrice?.toFixed(2)}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Created At</p>
          <p className="text-lg text-gray-700">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {subpage === 'status' && (
        <div className="mt-10">
          <OrderStatusUpdate
            id={id}
            currentStatus={order.status}
            onStatusUpdated={(newStatus) =>
              setOrder((prev) => ({ ...prev, status: newStatus }))
            }
          />
        </div>
      )}
    </div>
  );
};

export default AdminOrderDetail;
