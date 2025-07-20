import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../../api/authApi';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b']; // Indigo, Green, Amber

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    getAdminStats()
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching admin stats:', err.message));
  }, []);

  const chartData = [
    { name: 'Users', value: stats.totalUsers },
    { name: 'Products', value: stats.totalProducts },
    { name: 'Orders', value: stats.totalOrders },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      {/* Admin Greeting */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-700">👋 Welcome, {user?.name || 'Admin'}!</h1>
        <p className="text-gray-600 mt-1">Here’s an overview of your store activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-5 rounded-2xl shadow hover:scale-[1.02] transition">
          <h2 className="text-lg font-semibold text-indigo-700">👥 Total Users</h2>
          <p className="text-3xl font-bold mt-2 text-indigo-900">{stats.totalUsers}</p>
        </div>

        <div className="bg-gradient-to-br from-green-100 to-green-200 p-5 rounded-2xl shadow hover:scale-[1.02] transition">
          <h2 className="text-lg font-semibold text-green-700">📦 Total Products</h2>
          <p className="text-3xl font-bold mt-2 text-green-900">{stats.totalProducts}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-5 rounded-2xl shadow hover:scale-[1.02] transition">
          <h2 className="text-lg font-semibold text-yellow-700">🛒 Total Orders</h2>
          <p className="text-3xl font-bold mt-2 text-yellow-900">{stats.totalOrders}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Overview (Bar Chart)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 Distribution (Pie Chart)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
