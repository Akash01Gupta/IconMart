import React from 'react';

const getFullImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/80';
  return path.startsWith('http') ? path : `http://localhost:5000${path}`;
};

const CartItem = ({ item, onUpdate, onRemove }) => {
  const product = item.product;
  const imageSrc = getFullImageUrl(product?.imageUrl || product?.images?.[0]);

  const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    return '★'.repeat(fullStars).padEnd(5, '☆');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border border-gray-200 rounded-2xl bg-white p-5 shadow-md transition-all hover:shadow-lg">
      {/* Left: Image + Details */}
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        {/* Product Image */}
        <img
          src={imageSrc}
          alt={product?.name || 'Product'}
          onError={(e) => (e.target.src = 'https://via.placeholder.com/80')}
          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
        />

        {/* Product Info */}
        <div className="flex flex-col gap-2 text-sm text-gray-800">
          <h2 className="text-lg font-semibold text-gray-900">
            {product?.name || 'Unnamed Product'}
          </h2>

          <p className="text-gray-600 line-clamp-2 max-w-md">
            {product?.description || 'No description available.'}
          </p>

          <p className="text-yellow-500 text-sm font-medium">
            {product?.ratingsAvg
              ? `${renderStars(product.ratingsAvg)} ${product.ratingsAvg.toFixed(1)} ⭐ (${product.ratingsCount || 0})`
              : 'No ratings'}
          </p>

          <p className="font-semibold text-gray-900">
            ₹{product?.price?.toFixed(2) || '0.00'}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-700 font-medium">Qty:</span>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                onUpdate(item._id, Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
          </div>

          <p className="text-sm font-medium mt-1 text-gray-600">
            Total: ₹{(product?.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Right: Remove Button */}
      <div className="flex-shrink-0 self-center sm:self-start">
        <button
          onClick={() => onRemove(item._id)}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
