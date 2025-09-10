'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const ProductCard = React.memo(function ProductCard({ item }) {
  const image = item.image_url?.[0] || '/fallback.jpg'; // fallback nếu không có ảnh
  const description = item.shortDescription || '';

  return (
    <div className="group shadow-md rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <Link href={`/product/${item._id}`} className="block">
        <div>
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}productImg/${image}`}
            alt={item.name}
            width={500}
            height={320}
            className="w-full h-80 object-cover"
          />
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold italic font-['Brygada_1918']">{item.name}</h3>
            <p className="text-sm text-gray-600">{description}</p>
            <p className="text-sm font-bold mt-2">{item.price} $</p>
          </div>
        </div>
      </Link>

      <div className="text-center mb-4">
        <a
          className="mt-2 px-4 py-1 bg-[#4B0000] text-white text-sm rounded-full hover:bg-red-700"
          href={`/product/${item._id}`}
        >
          View More
        </a>
      </div>
    </div>
  );
});

export default ProductCard;
