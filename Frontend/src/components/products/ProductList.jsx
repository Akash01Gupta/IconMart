import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products = [] }) => {
  if (!products.length) {
    return (
      <div className="text-center py-12 text-gray-500 text-lg">
        No products found.
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="animate-fadeInUp transition-transform duration-300 transform hover:-translate-y-1"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
