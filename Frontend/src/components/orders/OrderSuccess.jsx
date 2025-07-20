import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-100">
        <div className="flex justify-center mb-4 animate-bounce-slow">
          <CheckCircle size={72} className="text-green-500 drop-shadow-md" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-3">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed">
          🎉 Thank you for your purchase! Your order has been successfully placed and will be shipped shortly.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
