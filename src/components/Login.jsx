"use client";

import React, { useState } from 'react';
import BlurText from './BlurText';
import { FiEye, FiEyeOff } from "react-icons/fi";
import dynamic from 'next/dynamic';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import GoogleButton from '@/components/GoogleButton';
import { toast, Toaster } from 'react-hot-toast';

const ModelViewer = dynamic(() => import('../components/ModelViewerWrapper'), {
  ssr: false,
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { password } = formData;

    if (password.length < 6 || password.length > 30) {
      toast.error("Mật khẩu phải từ 6 đến 30 ký tự!");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Login thành công -> push luôn
        setCookie('access_token', data.token);
        router.push("/");
      } else {
        toast.error(`Lỗi đăng nhập: ${data.message || 'Thông tin không đúng'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Không thể kết nối đến server');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-5xl h-[600px] flex rounded-xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-md">

        {/* Left side */}
        <div className="w-1/2 bg-[#f6f6f6] p-6 flex flex-col justify-center items-center text-gray-800 space-y-6">
          <img src="/logos/logo-fureal2-1.png" alt="Fureal Logo" className="w-40 h-auto" />
          <BlurText
            text="FURTHER - FURNITURE FOR REAL"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-lg font-AlegreySC text-center text-gray-800"
            repeatEvery={5000}
          />
          <div className="w-full max-w-lg h-[32rem]">
            <ModelViewer
              src="/3DObj/some_furniture.glb"
              alt="3D Room"
              auto-rotate
              camera-controls
              ar
              shadow-intensity="1"
              exposure="1.0"
              environment-image="neutral"
              tone-mapping="neutral"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="w-1/2 p-10 flex flex-col justify-center bg-white/90 rounded-r-lg">
          <h3 className="text-2xl font-semibold text-gray-800">Welcome back.</h3>
          <p className="text-gray-600 mb-6">Log in to manage your account</p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4b28b]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gray-400 px-4 py-2 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#d4b28b]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-xl text-gray-500 hover:text-[#b89064] focus:outline-none"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-[#b89064] hover:underline">
                Forget your password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full border-2 bg-[#c4a27d] text-white py-2 rounded-md hover:bg-[#b89064] hover:text-black transition"
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Sign-In button */}
            <GoogleButton />
          </form>

          <p className="mt-8 text-sm text-center text-gray-700">
            Do not have account?{" "}
            <a href="/register" className="text-[#b89064] hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
