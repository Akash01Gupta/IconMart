import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Loader2, AlertCircle } from 'lucide-react';

const InvoicesList = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLatestDeliveredOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const res = await axios.get('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const deliveredOrders = res.data
        .filter(order => order.status === 'Delivered')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrder(deliveredOrders[0] || null);
    } catch (err) {
      console.error('Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestDeliveredOrder();
  }, []);

  const handleDownloadInvoice = async () => {
    if (!order) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/orders/${order._id}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Invoice download error:', err);
      alert('Failed to download invoice.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        🧾 Latest Delivered Order
      </h2>

      {loading ? (
        <div className="flex justify-center items-center text-gray-500 text-lg">
          <Loader2 className="animate-spin mr-2 w-5 h-5" />
          Loading latest delivered order...
        </div>
      ) : !order ? (
        <div className="text-center text-gray-600 flex items-center justify-center gap-2 text-lg">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          No delivered order found.
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300">
          <div className="space-y-4 text-sm sm:text-base">
            <div>
              <p className="text-gray-500">Order ID</p>
              <p className="text-gray-800 font-semibold">{order._id}</p>
            </div>

            <div>
              <p className="text-gray-500">Date</p>
              <p className="text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            <div>
              <p className="text-gray-500">Total</p>
              <p className="text-green-700 font-bold text-lg">₹{order.totalPrice}</p>
            </div>

            <div>
              <p className="text-gray-500">Payment Method</p>
              <p className="text-gray-700">{order.paymentMethod || 'N/A'}</p>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleDownloadInvoice}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition duration-200 text-sm shadow"
            >
              <FileText className="w-4 h-4" />
              Download Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesList;


