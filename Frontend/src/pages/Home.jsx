import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/products/ProductList';
import Loader from '../components/common/Loader';
import { fetchProducts } from '../api/productApi';
import { useCart } from '../contexts/CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    addItem(product);
  };

  const handleViewDetails = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-red-600 font-medium text-center">
        <p className="mb-4 text-lg">⚠️ {error}</p>
        <button
          onClick={loadProducts}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="home-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
        {/* Optional future: Filter / Sort */}
      </div>

      <ProductList
        products={products}
        onAddToCart={handleAddToCart}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default Home;
