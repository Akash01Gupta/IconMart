import React, { useState, useEffect } from 'react';
import { signup } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const roles = ['user', 'admin', 'seller'];

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecret: '',
    sellerSecret: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear secrets when role changes
    setFormData((prev) => ({
      ...prev,
      adminSecret: '',
      sellerSecret: '',
    }));
  }, [role]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      ...(role === 'admin' && { adminSecret: formData.adminSecret }),
      ...(role === 'seller' && { sellerSecret: formData.sellerSecret }),
    };

    try {
      const data = await signup(payload);
      if (data.user) {
        navigate(role === 'user' ? '/login' : `/${role}/login`);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border shadow-xl rounded-2xl p-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Create Your Account</h2>

      {/* Role Tabs */}
      {/* <div className="flex justify-center gap-2 mb-6">
        {roles.map((r) => (
          <button
            key={r}
            className={`px-4 py-2 rounded-t-lg font-semibold text-sm transition ${
              role === r
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
            }`}
            onClick={() => setRole(r)}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div> */}

      {error && (
        <p className="text-red-600 text-sm text-center mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        {/* Dynamic Secret Field */}
        {role === 'admin' && (
          <input
            type="password"
            name="adminSecret"
            placeholder="Admin Secret"
            value={formData.adminSecret}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        )}
        {role === 'seller' && (
          <input
            type="password"
            name="sellerSecret"
            placeholder="Seller Secret"
            value={formData.sellerSecret}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating Account...' : `Sign Up as ${role}`}
        </button>
      </form>

      <div className="text-sm text-center mt-6">
        Already have an account?{' '}
        <a
          href={`/${role}/login`}
          className="text-blue-600 font-medium hover:underline"
        >
          Log in here
        </a>
      </div>
    </div>
  );
};

export default Signup;
