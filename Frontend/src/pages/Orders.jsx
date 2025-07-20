import React, { useEffect, useState } from 'react';
import Loader from '../components/common/Loader';
import OrderSummary from '../components/orders/OrderSummary';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded max-w-2xl mx-auto mt-6">
        {error}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-gray-600 text-base bg-gray-50 p-4 rounded border border-gray-200">
          You have no orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderSummary key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
