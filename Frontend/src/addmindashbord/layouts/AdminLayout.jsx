import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 text-gray-800 overflow-hidden">
      {/* Sticky Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl hidden md:flex flex-col">
        <div className="h-full p-6 flex flex-col">
          <h1 className="text-3xl font-bold tracking-wide mb-8 text-white">🛠 Admin</h1>
          <AdminSidebar />
        </div>
      </aside>

      {/* Scrollable Main Content */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-10 transition-all duration-300">
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-[90vh] border border-gray-200">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
