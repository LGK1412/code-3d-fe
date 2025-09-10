// src/components/BannerCarousel.jsx
"use client";

import { useState, useEffect } from 'react';

const images = [
  '/background/1.jpeg',
  '/background/BG4.png',
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // chuyển slide mỗi 2s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          <img
            src={src}
            alt={`Banner ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Overlay text */}
      <div className="absolute inset-0 z-20 bg-black/40 rounded-xl flex flex-col justify-center items-center text-white text-center px-4">
        <h1
          className="glitch text-7xl font-bold italic relative"
          data-text="Fureal"
          style={{ fontFamily: 'Inria Serif, serif' }}
        >
          Fureal
        </h1>


        <p
          className="text-lg mt-4 tracking-widest font-bold opacity-80"
          style={{ fontFamily: 'Inria Serif, serif' }}
        >
          Where Blurred Line Between Reality And Digital
        </p>

      </div>

    </div>
  );
}
