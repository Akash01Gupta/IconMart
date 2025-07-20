import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

const AdminPrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // simulate short delay to "check" role (optional UX enhancement)
    const timer = setTimeout(() => {
      setChecking(false);
    }, 300); // Delay for UX effect
    return () => clearTimeout(timer);
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600 font-medium">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center bg-white p-6 rounded shadow border border-red-200">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You must be an admin to access this page.</p>
          <Navigate to="/login" replace />
        </div>
      </div>
    );
  }

  return children;
};

export default AdminPrivateRoute;
