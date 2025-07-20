import React, { useState } from 'react';
import OrderTrackingDetails from './OrderTrackingDetails';

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [submittedOrderId, setSubmittedOrderId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderId.trim() === '') return;
    setSubmittedOrderId(orderId.trim());
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Track Your Order</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={{ padding: 8, width: '100%', fontSize: 16 }}
        />
        <button type="submit" style={{ marginTop: 10, padding: '8px 16px', fontSize: 16 }}>
          Track
        </button>
      </form>

      {submittedOrderId && <OrderTrackingDetails orderId={submittedOrderId} />}
    </div>
  );
};

export default TrackOrderPage;
