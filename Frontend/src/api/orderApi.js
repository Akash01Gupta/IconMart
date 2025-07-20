import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/orders';

// Helper to get auth headers if token is present
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Updated: Fetch all orders (admin only)
export const getAllOrders = async () => {
  const res = await axios.get(`${API_BASE}/all`, {
    headers: getAuthHeaders(),
  });
  return res.data.orders; // ✅ directly return array
};

// export const getDashboardSummary = async () => {
//   const res = await axios.get('/api/orders/summary/all');
//   return res.data;
// };
// Create new order
export const createOrder = (orderData) =>
  axios.post(API_BASE, orderData, { headers: getAuthHeaders() });

// Get single order by ID
export const getOrderById = (id) =>
  axios.get(`${API_BASE}/${id}`, { headers: getAuthHeaders() });

// Update order status
export const updateOrderStatus = (id, status) =>
  axios.patch(
    `${API_BASE}/${id}/status`,
    { status },
    { headers: getAuthHeaders() }
  );

export const getTrackingDetails = (orderId) =>
  axios.get(`${API_BASE}/${orderId}/tracking`, {
    headers: getAuthHeaders(),
  });

  export const cancelOrder = async (orderId) => {
  const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
  if (!confirmCancel) return;

  try {
    setLoadingCancel(orderId);

    await axios.patch(`/api/orders/${orderId}/cancel`, {}, {
      headers: {
        Authorization: `Bearer ${user?.token || localStorage.getItem('token')}`,
      },
    });

    // ✅ Remove cancelled order from UI
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order._id !== orderId)
    );
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to cancel the order. Please try again.';
    console.error('Failed to cancel order:', errorMsg);
    alert(errorMsg);
  } finally {
    setLoadingCancel(null);
  }
};
