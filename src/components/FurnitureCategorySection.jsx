"use client";

import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";

function FurnitureCarousel({ products, title }) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemWidth = 300;
  const gap = 32;
  const itemsPerPage = 4;
  const maxIndex = Math.ceil(products.length / itemsPerPage) - 1;

  const nextProduct = () =>
    setCarouselIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
  const prevProduct = () =>
    setCarouselIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1));

  return (
    <div className="py-12 relative">
      <h2 className="text-4xl font-serif font-bold text-center mb-6">
        Explore {title}
      </h2>

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
            {products.map((product, index) => (
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
    </div>
  );
}

export default function FurnitureCategorySection() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/group/groupInfor`
        );
        const result = await res.json();
        const filtered = (result.data || []).filter(
          (group) => group.products && group.products.length > 0
        );
        setGroups(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className="px-6 md:px-20">
      {groups.map((group, idx) => (
        <FurnitureCarousel
          key={idx}
          products={group.products}
          title={group.group_name}
        />
      ))}
    </div>
  );
}
