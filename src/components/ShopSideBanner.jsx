"use client";

import { useEffect, useState } from 'react';

const topBanners = [
  '/background/BG6.png',
];

const bottomBanners = [
  '/background/BG7.png',
];

export default function ShopSideBanner() {
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  useEffect(() => {
    const topTimer = setInterval(() => {
      setTopIndex((prev) => (prev + 1) % topBanners.length);
    }, 3000);

    const bottomTimer = setInterval(() => {
      setBottomIndex((prev) => (prev + 1) % bottomBanners.length);
    }, 4000);

    return () => {
      clearInterval(topTimer);
      clearInterval(bottomTimer);
    };
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 px-6 py-8">
      {/* Left Video */}
      <div className="w-full md:w-2/3 h-[600px] rounded-lg overflow-hidden">
        <video
  src="/background/videoBanner2.mp4"
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  className="w-full h-full object-cover rounded-lg shadow-lg"
/>

      </div>

      {/* Right Side Carousels */}
      <div className="w-full md:w-1/3 flex flex-col gap-2">
        {/* Top Carousel */}
        <div className="h-[295px] rounded-lg overflow-hidden">
          <img
            src={topBanners[topIndex]}
            alt="Top Banner"
            className="w-full h-full object-cover rounded-lg shadow"
          />
        </div>

        {/* Bottom Carousel */}
        <div className="h-[295px] rounded-lg overflow-hidden">
          <img
            src={bottomBanners[bottomIndex]}
            alt="Bottom Banner"
            className="w-full h-full object-cover rounded-lg shadow"
          />
        </div>
      </div>
    </div>
  );
}
