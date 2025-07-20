import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const OrderStatusUpdate = ({ id, currentStatus, onStatusUpdated }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // ✅ Must match enum values in the Mongoose schema exactly (case-sensitive)
  const statusOptions = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Returned',
    'Refunded',
  ];

  const handleStatusUpdate = async () => {
    if (!window.confirm(`Change status to "${status}"?`)) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status');

      alert('✅ Status updated successfully');
      onStatusUpdated?.(data.status);
    } catch (err) {
      alert('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <label className="block mb-1 font-medium">Update Order Status</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-3"
      >
        {statusOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <button
        onClick={handleStatusUpdate}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Status'}
      </button>
    </div>
  );
};

export default OrderStatusUpdate;
