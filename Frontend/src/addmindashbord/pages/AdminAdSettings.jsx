import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminAdSettings = () => {
  const [ad, setAd] = useState({ message: '', code: '', active: true });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState('');
  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await axios.get('/api/advertisement');
        const data = res.data || {};
        setAd(data);

        if (data.imageUrl) {
          setPreview(data.imageUrl.startsWith('http') ? data.imageUrl : `${BASE_URL}${data.imageUrl}`);
        }
      } catch (err) {
        console.error('Failed to fetch advertisement:', err.message);
      }
    };

    fetchAd();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAd({ ...ad, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('message', ad.message || '');
      formData.append('code', ad.code || '');
      formData.append('active', ad.active);
      if (imageFile) formData.append('image', imageFile);

      const res = await axios.put('/api/advertisement', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setAd(res.data);
      if (res.data?.imageUrl) {
        setPreview(res.data.imageUrl.startsWith('http') ? res.data.imageUrl : `${BASE_URL}${res.data.imageUrl}`);
      }
      setMessage('Advertisement updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update advertisement.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">🎯 Advertisement Settings</h2>
      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Message Input */}
        <div>
          <label className="block font-medium mb-1">Ad Message</label>
          <input
            type="text"
            name="message"
            value={ad.message}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter promotional message"
          />
        </div>

        {/* Discount Code Input */}
        <div>
          <label className="block font-medium mb-1">Discount Code</label>
          <input
            type="text"
            name="code"
            value={ad.code}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter discount code"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1">Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-3">
            <img
              src={preview}
              alt="Advertisement Preview"
              className="w-full rounded-lg shadow-lg max-h-60 object-contain border"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.png';
              }}
            />
          </div>
        )}

        {/* Active Toggle */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="active"
            checked={ad.active}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="text-sm">Ad is Active</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save Advertisement
        </button>
      </form>
    </div>
  );
};

export default AdminAdSettings;
