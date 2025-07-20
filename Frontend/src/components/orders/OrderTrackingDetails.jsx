import React, { useEffect, useState } from 'react';

const OrderTrackingDetails = ({ orderId }) => {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/orders/${orderId}/tracking`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch tracking info');
        const data = await res.json();
        setTracking(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchTracking();
  }, [orderId]);

  if (!orderId) return <p>No order ID provided.</p>;
  if (loading) return <p>Loading tracking info...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Tracking Info</h2>
      <p><strong>Status:</strong> {tracking.status}</p>
      <p><strong>Carrier:</strong> {tracking.carrier}</p>
      <p><strong>Tracking Number:</strong> {tracking.trackingNumber}</p>
      <p><strong>Estimated Delivery:</strong> {tracking.estimatedDelivery ? new Date(tracking.estimatedDelivery).toLocaleDateString() : 'N/A'}</p>
    </div>
  );
};

export default OrderTrackingDetails;
