import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Megaphone,
  LogOut,
} from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Advertise', path: '/admin/advertis', icon: <Megaphone size={20} /> },
  ];

  return (
    <div className="flex flex-col h-full space-y-1">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`flex items-center gap-3 py-2.5 px-4 rounded-lg font-medium transition duration-200
            ${location.pathname === item.path
              ? 'bg-gray-700 text-white shadow'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
          `}
        >
          {item.icon}
          {item.name}
        </Link>
      ))}

      <div className="mt-auto pt-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white transition duration-200 font-semibold"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
