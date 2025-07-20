import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    navigate(`/products?${params.toString()}`);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900 text-white shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap sm:flex-nowrap">
        {/* Logo & Search */}
        <div className="flex items-center gap-6 flex-grow">
          <Link to="/" className="text-3xl font-bold text-blue-400 tracking-wide hover:text-blue-300 transition">
            IconMart
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-grow max-w-md relative"
          >
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full py-2 pl-4 pr-10 rounded-md text-gray-900 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Menu */}
        <div className="flex items-center gap-4 text-sm sm:text-base">
          {/* Mobile Hamburger */}
          <button
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Navigation Links */}
          <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 absolute sm:static top-full left-0 w-full sm:w-auto bg-gray-900 sm:bg-transparent px-4 sm:px-0 py-4 sm:py-0 transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden'} sm:flex`}>
            <Link to="/products" className="hover:underline">Products</Link>
            <Link to="/cart" className="hover:underline">Cart ({cartItems.length})</Link>
            {user && <Link to="/orderspage" className="hover:underline">Orders</Link>}

          {user ? (
  <div className="relative" ref={menuRef}>
    <Link
      to="#"
      onClick={(e) => {
        e.preventDefault();
        setProfileOpen(!profileOpen);
      }}
      className="hover:underline flex items-center gap-1"
    >
      {user.name?.split(' ')[0]} ▾
    </Link>
    {profileOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg overflow-hidden z-50 animate-fadeIn">
        <div className="px-4 py-2 border-b text-sm font-medium bg-gray-50">
          👋 Hello, {user.name}
        </div>
        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
        <Link to="/invoices" className="block px-4 py-2 hover:bg-gray-100">Invoices</Link>
        <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            logout();
            setProfileOpen(false);
          }}
          className="block px-4 py-2 text-red-600 hover:bg-gray-100"
        >
          Logout
        </Link>
      </div>
    )}
  </div>
) : (
  <div className="flex gap-4">
    <Link to="/login" className="hover:underline">Login</Link>
  </div>
)}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
