"use client";

import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const bestsellerProducts = [
  { name: 'Tokyo Lamp', description: 'A modern design with warm light.', price: '89.00$', image: '/image/denngu.webp' },
  { name: 'Butterfly Chair', description: 'Ergonomic and stylish.', price: '129.00$', image: '/image/ghe1.jpg' },
  { name: 'Cupboard', description: 'Spacious with sleek doors.', price: '249.00$', image: '/image/cabinet1.jpg' },
  { name: 'Cabinet', description: 'Compact and elegant.', price: '49.00$', image: '/image/cabinet2.png' },
  { name: 'Desk Lamp', description: 'Bright and minimal.', price: '59.00$', image: '/image/denngu.webp' },
  { name: 'Wooden Chair', description: 'Natural wood finish.', price: '99.00$', image: '/image/denngu.webp' },
  { name: 'Wall Clock', description: 'Minimalist round clock.', price: '39.00$', image: '/image/denngu.webp' },
  { name: 'Bookshelf', description: 'Spacious and elegant.', price: '149.00$', image: '/image/denngu.webp' },
];

export default function BestsellerOnly() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemWidth = 364;
  const itemsPerPage = 4;
  const maxGroupIndex = Math.ceil(bestsellerProducts.length / itemsPerPage) - 1;

  const nextProduct = () => {
    setCarouselIndex((prev) => (prev + 1 > maxGroupIndex ? 0 : prev + 1));
  };

  const prevProduct = () => {
    setCarouselIndex((prev) => (prev - 1 < 0 ? maxGroupIndex : prev - 1));
  };

  return (
    <div className="py-16 px-6 md:px-20 relative overflow-hidden">
      <h2 className="text-6xl font-serif italic font-bold text-center mb-10">Bestsellers</h2>

      <div className="relative flex items-center justify-center">
        {/* Left Arrow */}
        <button
          onClick={prevProduct}
          className="absolute left-0 p-2 shadow rounded-full z-10"
        >
          <FaChevronLeft />
        </button>

        {/* Carousel container */}
        <div className="overflow-hidden w-[1400px] px-2">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              width: `${bestsellerProducts.length * itemWidth}px`,
              transform: `translateX(-${carouselIndex * itemWidth * itemsPerPage}px)`,
            }}
          >
            {bestsellerProducts.map((product, index) => (
              <div
                key={index}
                className="rounded-md p-4 text-center w-[300px] flex-shrink-0 mx-8"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-72 object-cover rounded mb-3"
                />
                <p className="text-xl font-bold font-Brygada 1918 italic">{product.name}</p>
                <p className="text-base font-Brygada 1918 text-gray-500 my-2">{product.description}</p>
                <p className="text-[#4B0000] font-bold font-Brygada 1918 text-md">{product.price}</p>
                <button className="mt-4 px-5 py-2 border-2 border-black text-black rounded-full hover:bg-[#4B0000] hover:text-white transition duration-300 text-base">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextProduct}
          className="absolute right-0 p-2 shadow rounded-full z-10"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
