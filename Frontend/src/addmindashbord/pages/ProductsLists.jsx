import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../api/productApi';
import { useAuth } from '../../contexts/AuthContext';

const useQuery = () => new URLSearchParams(useLocation().search);

const ProductLists = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', brand: '', price: '', quantity: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [editId, setEditId] = useState(null);
  const { token } = useAuth();
  const query = useQuery();
  const searchTerm = query.get('search')?.toLowerCase() || '';

  const loadProducts = async () => {
    try {
      const res = await fetchProducts();
      setProducts(res);
    } catch (error) {
      console.error('Failed to load products:', error.message);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      if (imageFile) form.append('image', imageFile);

      if (editId) {
        await updateProduct(editId, form, token, true);
      } else {
        await createProduct(form, token, true);
      }

      // Reset
      setFormData({
        name: '', description: '', category: '', brand: '', price: '', quantity: ''
      });
      setImageFile(null);
      setPreview('');
      setEditId(null);
      loadProducts();
    } catch (error) {
      console.error('Product submission failed:', error.message);
    }
  };

  const handleEdit = (product) => {
    const { _id, imageUrl, ...rest } = product;
    setFormData(rest);
    setEditId(_id);
    setPreview(imageUrl || '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteProduct(id, token);
        loadProducts();
      } catch (error) {
        console.error('Failed to delete product:', error.message);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">{editId ? 'Edit Product' : 'Add New Product'}</h2>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 bg-white p-6 rounded-xl shadow"
      >
        {['name', 'description', 'category', 'brand', 'price', 'quantity'].map((key) => (
          <input
            key={key}
            type={key === 'price' || key === 'quantity' ? 'number' : 'text'}
            name={key}
            value={formData[key]}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-blue-500"
          />
        ))}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="col-span-1 md:col-span-2"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-28 h-28 rounded object-cover border"
          />
        )}

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {editId ? 'Update Product' : 'Create Product'}
        </button>
      </form>

      {/* Product Table */}
      {filteredProducts.length === 0 ? (
        <p className="text-red-600 text-center">No products found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Image</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Quantity</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod) => (
                <tr key={prod._id} className="border-t hover:bg-blue-50 transition">
                  <td className="px-4 py-3 font-medium">{prod.name}</td>
                  <td className="px-4 py-3">
                    {prod.imageUrl && (
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-14 h-14 rounded object-cover border"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-green-700 font-semibold">₹{prod.price}</td>
                  <td className="px-4 py-3">{prod.quantity}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="text-sm px-3 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductLists;
