import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrderById } from '../../api/orderApi';
import OrderStatusUpdate from '../OrderDetails/OrderStatusUpdate';

const OrderDetailView = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getOrderById(id);
        const fetchedOrder = response.data ? response.data : response;
        setOrder(fetchedOrder);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center text-gray-600 text-lg">⏳ Loading order details...</div>;
  if (error) return <div className="text-center text-red-500 font-semibold">❌ Error: {error}</div>;
  if (!order) return <div className="text-center text-gray-600">No order data found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 border-b pb-3">🧾 Order Details</h2>

      {/* Order ID */}
      <div className="mb-4 text-gray-700">
        <span className="font-semibold">🆔 Order ID:</span>
        <span className="ml-2 font-mono text-indigo-600">{order._id}</span>
      </div>

      {/* Status */}
      <div className="mb-4 text-gray-700">
        <span className="font-semibold">📦 Status:</span>
        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Delivered'
          ? 'bg-green-100 text-green-700'
          : order.status === 'Cancelled'
            ? 'bg-red-100 text-red-700'
            : 'bg-yellow-100 text-yellow-700'
          }`}>
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">🛍️ Items</h3>
        <ul className="space-y-3">
          {order.items.map((item, idx) => (
            <li
              key={idx}
              className="border p-4 rounded-lg bg-gray-50 flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="text-gray-800 font-medium">{item.product?.name || 'Unnamed Product'}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity} × ₹{item.product?.price?.toFixed(2) || 'N/A'}
                </p>
              </div>
              <p className="text-right font-semibold text-blue-600">
                ₹{(item.quantity * (item.product?.price || 0)).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Status Update */}
      <div className="mt-8">
        <OrderStatusUpdate
          id={order._id}
          currentStatus={order.status}
          onStatusUpdated={(newStatus) =>
            setOrder((prev) => ({ ...prev, status: newStatus }))
          }
        />
      </div>
    </div>
  );
};

export default OrderDetailView;
