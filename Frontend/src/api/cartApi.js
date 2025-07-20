const API_BASE = 'http://localhost:5000/api';
import axios from "axios";

export const getCartItems = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE}/cart`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    return { unauthorized: true };
  }

  if (!response.ok) {
    const text = await response.text();
    console.error('Failed to fetch cart items:', text);
    throw new Error('Failed to fetch cart items');
  }

  return response.json();
};


export const addToCartAPI = async (productId, quantity = 1, token) => {
  const res = await axios.post(
    `http://localhost:5000/api/cart/add/${productId}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`/api/cart/update/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || 'Failed to update cart item');
  }

  return response.json(); // should return { item: {...} }
};


export const removeCartItem = async (itemId) => {
  const res = await fetch(`/api/cart/${itemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to remove cart item');
  }

  const data = await res.json();
  return data;  // { success: true, message: ..., items: [...] }
};



