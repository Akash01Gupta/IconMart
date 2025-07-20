import React, { useEffect, useState } from 'react';
import ProductList from '../components/products/ProductList';
import Loader from '../components/common/Loader';
import { fetchProducts } from '../api/productApi';
import { useCart } from '../contexts/CartContext';
import { useLocation } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { addItem } = useCart();

  const searchTerm = new URLSearchParams(location.search).get('search')?.toLowerCase() || '';

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    addItem(product._id, 1);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.category?.toLowerCase().includes(searchTerm)
  );

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600 text-center py-4">{error}</div>;

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {searchTerm ? `Search Results for "${searchTerm}"` : 'All Products'}
      </h1>

      {filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} onAddToCart={handleAddToCart} />
      ) : (
        <div className="text-center text-lg text-gray-600 border border-dashed border-gray-300 rounded p-6">
          <p className="mb-2">😕 No products found for "<span className="text-red-500 font-semibold">{searchTerm}</span>"</p>
          <p className="text-sm text-gray-500">Try a different keyword or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default Products;
