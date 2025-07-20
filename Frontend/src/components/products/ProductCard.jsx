import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  if (!product || !product._id) {
    return (
      <div className="text-red-500 p-4 border border-red-400 rounded bg-red-50">
        Invalid product
      </div>
    );
  }

  const handleNavigate = () => {
    navigate(`/products/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await addItem(product._id, 1);
      navigate('/cart');
    } catch (err) {
      alert(err.message || 'Failed to add to cart');
    }
  };

  const imageSrc = product.imageUrl?.startsWith('http')
    ? product.imageUrl
    : `http://localhost:5000${product.imageUrl}`;

  return (
    <div
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleNavigate();
      }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col border border-gray-200"
    >
      {/* Product Image */}
      <div className="w-full h-56 bg-gray-100 overflow-hidden rounded-t-xl">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = '/placeholder.png';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-semibold text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description || product.category}
        </p>

        <div className="mt-2 text-blue-600 font-bold text-lg">
          ₹{product.price?.toFixed(2)}
        </div>

        {/* Stock Info */}
        <p
          className={`text-sm mt-1 ${(product.countInStock || product.quantity) > 0 ? 'text-green-600' : 'text-red-600'
            }`}
        >
          {(product.countInStock || product.quantity) > 0
            ? `In Stock: ${product.countInStock || product.quantity}`
            : 'Out of Stock'}
        </p>


        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
          className={`mt-auto text-white text-sm font-medium py-2 px-4 rounded-lg shadow transition ${product.countInStock === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
