import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CartProvider } from '../contexts/CartContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import axios from 'axios';

const MainLayout = () => {
  const location = useLocation();
  const path = location.pathname;
  const showBanner = path === '/' || path.startsWith('/products');

  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await axios.get('/api/advertisement');
        setAd(res.data);
      } catch (err) {
        console.error('Ad fetch failed:', err);
      }
    };

    fetchAd();
  }, []);

  const getImageUrl = (url) => {
    // Ensure correct full URL for backend-served image
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`; // adjust for your environment
  };

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-4">
          {showBanner && ad?.active && (
            <>
              <section className="bg-yellow-300 text-black text-center font-semibold py-2 px-4 rounded mb-4 shadow-md">
                🎉 <strong>{ad.message}</strong>
                {ad.code && (
                  <>
                    {' '}Use code:{' '}
                    <code className="bg-white px-1 py-0.5 rounded text-blue-600 font-mono">
                      {ad.code}
                    </code>
                  </>
                )}
              </section>

              {ad.imageUrl && (
                <figure className="w-full mb-6 overflow-hidden rounded shadow-md max-h-[250px] flex justify-center">
                  <img
                    src={getImageUrl(ad.imageUrl)}
                    alt="Advertisement banner"
                    className="w-full object-cover object-center max-h-[250px] rounded"
                    loading="lazy"
                  />
                </figure>
              )}
            </>
          )}

          <Outlet />
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
};

export default MainLayout;
