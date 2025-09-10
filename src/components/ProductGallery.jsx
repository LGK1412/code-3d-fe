"use client";

import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import ProductCard from './ProductCard';

const PRODUCTS_PER_PAGE = 12;

function ProductGallery() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/product`);
        const data = await res.json();
        setProducts(data.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const displayed = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="text-center">
      {/* Heading */}
      <h2 className="text-5xl font-serif italic font-bold text-center mb-10">Collection</h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <div className="flex w-[500px] shadow-md rounded-full overflow-hidden border border-gray-300">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-grow px-6 py-3 text-base outline-none rounded-l-full"
          />
          <button className="bg-black text-white px-5 flex items-center justify-center">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-10 px-2">
          {displayed.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded-full ${currentPage === i + 1 ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
