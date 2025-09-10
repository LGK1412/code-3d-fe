"use client";

import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('../components/ModelViewerWrapper'), {
  ssr: false,
});

const sofaImages = [
  '/image/sofa-xanh1.png',
  '/image/sofa-xanh2.png',

];

export default function BestsellerSection() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [sofaIndex, setSofaIndex] = useState(0);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);

  const itemWidth = 300; // w-[300px]
  const gap = 32; // gap-8
  const itemsPerPage = 4;
  const totalItems = 12;
  const maxGroupIndex = Math.ceil(totalItems / itemsPerPage) - 1; // 3 - 1 = 2

  // Giữ đúng 12 item
  const productsToShow = bestsellerProducts.slice(0, totalItems);

  const nextProduct = () => {
    setCarouselIndex((prev) => (prev + 1 > maxGroupIndex ? 0 : prev + 1));
  };

  const prevProduct = () => {
    setCarouselIndex((prev) => (prev - 1 < 0 ? maxGroupIndex : prev - 1));
  };

  // Auto rotate sofa images
  useEffect(() => {
    const interval = setInterval(() => {
      setSofaIndex((prev) => (prev + 1) % sofaImages.length);
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/product/bestsell`); // nếu route BE nằm ở /api
        const data = await res.json();
        if (data.success) {
          setBestsellerProducts(data.data); // data phải là mảng [{ name, price, shortDescription, image }]
        }
      } catch (err) {
        console.error("Lỗi khi fetch bestseller:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="py-16 px-6 md:px-20 relative overflow-hidden">
      {/* Bestsellers Section */}
      <h2 className="text-6xl font-serif italic font-bold text-center mb-10">Bestsellers</h2>

      <div className="relative flex items-center justify-center w-full">
        {/* Left Arrow */}
        <button
          onClick={prevProduct}
          className="absolute -left-14 p-3 bg-white shadow rounded-full z-10 hover:bg-gray-100 transition"
        >
          <FaChevronLeft />
        </button>

        {/* Carousel container */}
        <div className="overflow-hidden w-full max-w-[1400px]">
          <div
            className="flex gap-8 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${carouselIndex * (itemWidth + gap) * itemsPerPage
                }px)`,
            }}
          >
            {productsToShow.map((product, index) => (
              <div
                key={index}
                className="rounded-md p-4 text-center w-[300px] flex-shrink-0"
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}productImg/${product.image_url[0]}`}
                  alt={product.name}
                  className="w-full h-72 object-cover rounded mb-3"
                />
                <p className="text-xl font-bold font-Brygada 1918 italic">
                  {product.name}
                </p>
                <p className="text-base font-Brygada 1918 text-gray-500 my-2">
                  {product.shortDescription}
                </p>
                <p className="text-[#4B0000] font-bold font-Brygada 1918 text-md">
                  {product.price}$
                </p>
                <Link
                  href={`/product/${product._id}`}
                  className="mt-4 inline-block px-5 py-2 border-2 border-black text-black rounded-full hover:bg-[#4E7145] hover:text-white transition duration-300 text-base"
                >
                  View More
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextProduct}
          className="absolute -right-14 p-3 bg-white shadow rounded-full z-10 hover:bg-gray-100 transition"
        >
          <FaChevronRight />
        </button>
      </div>


      {/* Sofa Section */}
      <div className="relative flex flex-col items-center justify-center min-h-[100vh] px-6 md:px-20 overflow-hidden ">
        {/* Nội dung chính */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 w-full mt-12">

          {/* Text Left */}
          <div className="md:w-1/2 text-center md:text-left">
            <h3 className="text-6xl font-serif font-bold text-[#1e1e1e] mb-4">SOFA</h3>
            <p className="text-gray-700 text-2xl leading-relaxed mb-6 max-w-md mx-auto md:mx-0">
              Velvet green sofa with sleek lines and wooden legs. A stylish, versatile piece offering both comfort and modern elegance.
            </p>
            <button className="bg-[#4B0000] text-white py-2 px-4 rounded-full text-xl hover:bg-[#3a0000] transition font-semibold">
              Shopping now
            </button>
          </div>

          {/* Sofa Right 3D Model */}
          <div className="relative md:w-1/2 w-full flex items-center justify-center">
            <div className="absolute w-[600px] h-[500px] bg-[#ffe6b3] rounded-full blur-[80px] opacity-90 -z-10" />
            <ModelViewer
              src="/3DObj/sofa-xanh1.glb"
              alt="3D Sofa"
              auto-rotate
              camera-controls
              ar
              environment-image="neutral"
              style={{
                width: '800px',
                height: '700px',
              }}
              className="drop-shadow-[0_40px_80px_rgba(0,0,0,0.25)] transition duration-500 ease-in-out"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
