import axios from 'axios';

const API_BASE = '/api';
const USER_API = `${API_BASE}/user`;
const ADMIN_API = `${API_BASE}/admin`;

// ---------------------- Signup (Updated) ----------------------
export const signup = async ({ name, email, password, role = 'user', adminSecret, sellerSecret }) => {
  try {
    const payload = {
      name,
      email,
      password,
      role,
    };

    if (role === 'admin') {
      payload.adminSecret = adminSecret;
    } else if (role === 'seller') {
      payload.sellerSecret = sellerSecret;
    }

    const res = await axios.post(`${API_BASE}/signup`, payload);
    return res.data;
  } catch (err) {
    // Let the calling function handle the error
    throw err.response?.data || new Error('Signup failed');
  }
};
// ---------------------- Login ----------------------
export const login = async ({ email, password }) => {
  try {
    const res = await axios.post(`${API_BASE}/login`, { email, password });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Login failed');
  }
};

export const adminLogin = async ({ email, password }) => {
  try {
    const res = await axios.post(`${ADMIN_API}/login`, { email, password });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Admin login failed');
  }
};

// ---------------------- Axios Instances ----------------------
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn(`⚠️ No token found for ${baseURL}`);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

const userAPI = createAxiosInstance(USER_API);
const adminAPI = createAxiosInstance(ADMIN_API);

// ---------------------- User APIs ----------------------
export const getProfile = () => userAPI.get('/profile');
export const updateProfile = (data) => userAPI.put('/profile', data);
export const deleteAccount = () => userAPI.delete('/profile');
export const changePassword = (data) => userAPI.put('/profile/password', data);
export const resetPassword = (id, data) =>
  axios.put(`${USER_API}/reset-password/${id}`, data);

// ---------------------- Admin APIs ----------------------
export const getAdminStats = async () => {
  try {
    const res = await adminAPI.get('/stats');
    return res.data;
  } catch (err) {
    console.error(' Failed to fetch admin stats:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Failed to fetch admin stats');
  }
};

export const fetchAllUsers = () => adminAPI.get('/users');
export const getSingleUser = (id) => adminAPI.get(`/users/${id}`);
export const deleteUser = (id) => adminAPI.delete(`/users/${id}`);
export const updateUserRole = (id, role) =>
  adminAPI.put(`/users/${id}/role`, { role });

// ---------------------- Forgot Password ----------------------
export const sendResetLink = async ({ email }) => {
  try {
    const res = await axios.post(`${USER_API}/forgot-password`, { email });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to send reset link');
  }
};

