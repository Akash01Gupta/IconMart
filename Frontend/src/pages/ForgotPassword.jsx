import React, { useState } from 'react';
import { sendResetLink } from '../api/authApi'; // Make sure this API exists and is working
import { Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    try {
      await sendResetLink({ email });
      setStatus('✅ Reset link sent to your email');
    } catch (err) {
      setError('❌ Failed to send reset link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🔐 Forgot Password
        </h2>

        {status && (
          <div className="bg-green-100 text-green-700 text-sm px-4 py-2 rounded mb-4">
            {status}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 w-4 h-4" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
