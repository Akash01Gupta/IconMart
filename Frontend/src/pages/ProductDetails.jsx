import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/common/Loader';
import { jwtDecode } from 'jwt-decode';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded?.id || null;
};

const getFullImageUrl = (path) => {
  if (!path) return '/placeholder.png';
  return path.startsWith('http') ? path : `http://localhost:5000${path}`;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [editReviewId, setEditReviewId] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const currentUserId = getUserIdFromToken();

  const fetchProduct = useCallback(async (productId) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${productId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setProduct(res.data);
      const rawImage = res.data.images?.[0] || res.data.imageUrl || null;
      setSelectedImage(getFullImageUrl(rawImage));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProduct(id);
  }, [id, fetchProduct]);

  const handleAddToCart = async (productId) => {
    if (!token) return alert('Please login to add items to cart');
    try {
      await axios.post(
        `http://localhost:5000/api/cart/add/${productId}`,
        { quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/cart');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add item to cart');
    }
  };

  const handleSubmitReview = async () => {
    if (!token) return alert('Please login to submit a review');
    if (userRating < 1 || userRating > 5) return alert('Select a rating between 1 and 5');

    setSubmitting(true);
    try {
      await axios.post(
        `http://localhost:5000/api/products/${id}/rate`,
        { rating: userRating, comment: userComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserComment('');
      setUserRating(0);
      fetchProduct(id);
      alert('Thank you for your review!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = async (reviewId) => {
    setSubmitting(true);
    try {
      await axios.put(
        `http://localhost:5000/api/products/${id}/reviews/${reviewId}`,
        { rating: editRating, comment: editComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditReviewId(null);
      fetchProduct(id);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProduct(id);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete review');
    }
  };

  const renderStars = (value, onClickFn = null) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          onClick={onClickFn ? () => onClickFn(i + 1) : undefined}
          className={`text-2xl ${i < value ? 'text-yellow-400' : 'text-gray-300'} ${onClickFn ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>No product found.</p>;

  // ✅ Safe stock count handling
  const stockCount = product.countInStock ?? product.quantity ?? 0;

  return (
    <div className="min-h-screen py-10 px-4 max-w-5xl mx-auto space-y-12">
      {/* Product Card */}
      <div className="p-6 rounded-xl border shadow">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-xl text-green-600 mb-4 font-semibold">₹{product.price?.toFixed(2)}</p>

        <div className="w-full max-w-md mx-auto aspect-[4/3] mb-6">
          <img
            src={selectedImage}
            alt={product.name}
            onError={(e) => { e.target.src = '/placeholder.png'; }}
            className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
          {(product.images || [product.imageUrl]).map((img, i) => {
            const fullImg = getFullImageUrl(img);
            return (
              <button
                key={i}
                onClick={() => setSelectedImage(fullImg)}
                className={`w-20 h-20 border-2 rounded overflow-hidden ${selectedImage === fullImg ? 'border-blue-500' : 'border-gray-300'}`}
              >
                <img
                  src={fullImg}
                  alt={`thumb-${i}`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = '/placeholder.png')}
                />
              </button>
            );
          })}
        </div>

        <p className="text-gray-700 mt-4">{product.description}</p>
        <p className="text-sm text-gray-500 mt-1">
          ⭐ {product.ratingsAvg?.toFixed(1)} ({product.ratingsCount || 0} ratings)
        </p>

        <p className={`text-sm mt-2 font-medium ${stockCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stockCount > 0 ? `In Stock: ${stockCount}` : 'Out of Stock'}
        </p>

        <button
          className={`mt-4 px-6 py-2 rounded-lg text-white transition font-medium ${stockCount > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          onClick={() => handleAddToCart(product._id)}
          disabled={stockCount === 0}
        >
          {stockCount > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>

      {/* Review Form */}
      <div className="p-6 rounded-xl border shadow">
        <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
        <div className="mb-3">{renderStars(userRating, setUserRating)}</div>
        <textarea
          className="w-full border rounded p-3"
          placeholder="Share your experience..."
          rows={4}
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
        />
        <button
          disabled={submitting || userRating < 1 || !userComment.trim()}
          onClick={handleSubmitReview}
          className={`mt-4 px-5 py-2 rounded-lg text-white font-medium ${submitting || userRating < 1 || !userComment.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>

      {/* Review List */}
      {product.reviews?.length > 0 && (
        <div className="p-6 rounded-xl border shadow">
          <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
          {product.reviews.map((review) => (
            <div key={review._id} className="border-b py-4">
              <div className="flex justify-between items-center">
                <strong>{review.name}</strong>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-2">{renderStars(review.rating)}</div>
              {editReviewId === review._id ? (
                <>
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                  <div className="mt-2">{renderStars(editRating, setEditRating)}</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEditReview(review._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditReviewId(null)}
                      className="text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700 mt-1">{review.comment}</p>
                  {currentUserId === review.user?.toString() && (
                    <div className="mt-2 flex gap-4">
                      <button
                        onClick={() => {
                          setEditReviewId(review._id);
                          setEditComment(review.comment);
                          setEditRating(review.rating);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
