"use client";

import React from 'react';
import ProductCard from './ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function OtherProductOnly({ data }) {
  return (
    <div className="text-center py-10">
      <h2 className="text-3xl md:text-4xl font-bold font-serif italic text-[#4B0000] mb-6">
        Other Products
      </h2>

      <div className="px-4 relative">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: '.custom-swiper-button-next',
            prevEl: '.custom-swiper-button-prev',
          }}
          pagination={{
            el: '.custom-swiper-pagination',
            clickable: true,
          }}
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 }, // Hiển thị tối đa 5 sản phẩm
          }}
        >
          {data.map((item) => (
            <SwiperSlide key={item.id}>
              <ProductCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Controls Positioned Below */}
        <div className="mt-6 flex justify-center items-center gap-4">
          <button className="custom-swiper-button-prev bg-gray-100 hover:bg-gray-400 text-black px-4 py-2 rounded">
            &larr;
          </button>
          <div className="custom-swiper-pagination" />
          <button className="custom-swiper-button-next bg-gray-100 hover:bg-gray-400 text-black px-4 py-2 rounded">
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default OtherProductOnly;
