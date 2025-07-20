import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sidebar,
  Menu,
  MenuItem,
  useProSidebar,
  sidebarClasses,
  menuClasses,
} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import {
  LogOut,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Megaphone,
  MenuIcon,
} from 'lucide-react';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { collapseSidebar, toggleSidebar } = useProSidebar();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        breakPoint="md"
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: '#111827', // Tailwind gray-900
            color: '#fff',
            borderRight: '1px solid #1f2937',
            paddingTop: '1rem',
          },
        }}
      >
        <Menu
          rootStyles={{
            [`.${menuClasses.button}`]: {
              padding: '12px 20px',
              borderRadius: '0.375rem',
              margin: '4px 8px',
              fontWeight: 500,
            },
            [`.${menuClasses.button}:hover`]: {
              backgroundColor: '#1f2937', // Tailwind gray-800
              color: '#fff',
            },
          }}
        >
          <MenuItem icon={<LayoutDashboard size={20} />} component={<Link to="/admin/dashboard" />}>
            Dashboard
          </MenuItem>
          <MenuItem icon={<Package size={20} />} component={<Link to="/admin/products" />}>
            Products
          </MenuItem>
          <MenuItem icon={<ShoppingCart size={20} />} component={<Link to="/admin/orders" />}>
            Orders
          </MenuItem>
          <MenuItem icon={<Users size={20} />} component={<Link to="/admin/users" />}>
            Users
          </MenuItem>
          <MenuItem icon={<Megaphone size={20} />} component={<Link to="/admin/advertis" />}>
            Advertise
          </MenuItem>
          <MenuItem icon={<LogOut size={20} />} onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={toggleSidebar}
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <MenuIcon size={18} />
            Toggle Sidebar
          </button>
        </div>

        {/* Replace below div with <Outlet /> or dynamic content */}
        <div className="bg-white p-6 rounded shadow text-gray-700">
          <p>Welcome to the Admin Panel. Select a menu item to begin.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
