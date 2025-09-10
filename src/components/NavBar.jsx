"use client";

import {
  FaRegLightbulb,
  FaSearch,
  FaFilter,
  FaChair,
  FaBed,
  FaBoxOpen,
  FaThLarge,
  FaChevronDown,
  FaShoppingCart,
  FaUserCircle,
} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { parseCookies } from "nookies";
import * as jose from 'jose';

const menuTextSize = 'text-xl';

export default function NavBar() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const dropdownRef = useRef(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [hasToken, setHasToken] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const handleCategoryClick = (subcategory) => {
    const formatted = subcategory.toLowerCase().replace(/\s+/g, '-');
    router.push(`/category/${formatted}`);
    setDropdownOpen(false);
  };
  // Check cookies
  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.access_token) {
      try {
        const decoded = jose.decodeJwt(cookies.access_token);
        setHasToken(true);
        if (decoded.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }, []);

  // Fetch dữ liệu group từ API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/group/notHide`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Lỗi tải group");
        setCategoriesData(data.data || []);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchGroups();
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };


  return (
    <nav className="sticky top-0 z-50 w-full bg-[#d3cfc5] shadow-md px-10 py-1 flex items-center justify-between min-h-[90px]">
      {/* Logo */}
      <div className="flex items-center gap-6 pl-8">
        <img src="/logos/logo-fureal2-1.png" alt="Logo" className="w-[120px] h-auto" />
      </div>

      {/* Main Menu */}
      <div className={`hidden lg:flex flex-1 justify-center gap-10 text-black tracking-wide uppercase font-alegreya ${menuTextSize}`}>
        <Link href="/" className="hover:text-[#5e0000] hover:font-semibold transition duration-200">
          Home
        </Link>

        {/* CATEGORIES Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:text-[#5e0000] hover:font-semibold transition duration-200"
          >
            CATEGORIES
            <FaChevronDown className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && categoriesData.length > 0 && (
            <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md w-[600px] z-50 flex">
              {/* Cột group */}
              <div className="w-1/3 border-r border-gray-200 bg-gray-50">
                {categoriesData.map((group) => (
                  <div
                    key={group._id}
                    onMouseEnter={() => setActiveGroup(group)}
                    className={`px-4 py-2 cursor-pointer hover:bg-[#f5f5f5] ${activeGroup?._id === group._id ? "bg-[#f0e6e6]" : ""
                      }`}
                  >
                    {group.name}
                  </div>
                ))}
              </div>

              {/* Cột category */}
              <div className="w-2/3 p-4">
                {activeGroup?.category?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-x-6">
                    {chunkArray(activeGroup.category, 7).map((col, colIndex) => (
                      <ul key={colIndex} className="space-y-2">
                        {col.map((cat) => (
                          <li key={cat._id}>
                            <button
                              onClick={() => handleCategoryClick(cat.name)}
                              className="text-left text-sm text-gray-700 hover:text-[#5e0000] hover:underline"
                            >
                              {cat.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No categories</p>
                )}
              </div>
            </div>
          )}
        </div>

        <Link href="/shop" className="hover:text-[#5e0000] hover:font-semibold transition duration-200">
          Shop
        </Link>
        <Link href="/about_us" className="hover:text-[#5e0000] hover:font-semibold transition duration-200">
          About Us
        </Link>
        <Link href="/view_3d" className="hover:text-[#5e0000] hover:font-semibold transition duration-200">
          Creative Space
        </Link>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-10">
        <div className="relative flex items-center bg-white rounded-full overflow-hidden w-[400px] max-w-[80vw] border border-gray-200">
          <input
            type="text"
            placeholder="Search here..."
            className="pl-4 pr-16 py-1 text-lg w-full text-[#5e0000] placeholder-[#5e0000] focus:outline-none font-alegreya"
          />
          <FaSearch className="absolute right-12 text-[#5e0000] text-xl" />
          <FaFilter className="absolute right-4 text-[#5e0000] text-xl" />
        </div>

        <button
          onClick={() => router.push('/cart')}
          className="text-black text-3xl hover:animate-shake transition"
          aria-label="Cart"
        >
          <FaShoppingCart />
        </button>

        {hasToken ? (
          <FaUserCircle
            onClick={() => router.push(isAdmin ? "/admin/dashboard" : "/profile")}
            className="text-[#5e0000] hover:text-[#a00000] text-3xl cursor-pointer transition"
          />
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="text-[#5e0000] hover:text-[#a00000] text-xl px-5 py-2 uppercase font-semibold font-alegreya tracking-wide transition-colors duration-200"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
