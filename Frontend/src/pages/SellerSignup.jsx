// pages/SellerSignup.jsx
import React, { useState } from 'react';
import { signup } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

export default function SellerSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    sellerSecret: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const data = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        sellerSecret: formData.sellerSecret,
        role: 'seller',
      });
      if (data.user) navigate('/seller/login');
      else setError(data.message || 'Signup failed');
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4 text-center font-semibold">Seller Sign Up</h2>
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <form onSubmit={onSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={onChange} className="w-full p-2 border rounded" />
        <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={onChange} className="w-full p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={onChange} className="w-full p-2 border rounded" />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={onChange} className="w-full p-2 border rounded" />
        <input type="password" name="sellerSecret" placeholder="Seller Secret" required value={formData.sellerSecret} onChange={onChange} className="w-full p-2 border rounded" />

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
