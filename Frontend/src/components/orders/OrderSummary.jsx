import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

const OrderSummary = ({ order }) => {
  const isPaid = order.isPaid;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
          Order #{order._id}
        </h2>
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${
            isPaid
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {isPaid ? (
            <>
              <CheckCircle className="w-4 h-4" /> Paid
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" /> Pending
            </>
          )}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        <span className="font-medium">Date:</span>{' '}
        {new Date(order.createdAt).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        <span className="font-medium">Total:</span> ₹{order.totalPrice.toFixed(2)}
      </p>
    </div>
  );
};

export default OrderSummary;
