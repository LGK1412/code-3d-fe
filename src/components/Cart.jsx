"use client";

import React, { useEffect, useState } from "react";
import { jwtVerify } from 'jose';
import { parseCookies } from 'nookies';
import toast from 'react-hot-toast';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const deliveryFee = 15;

  const fetchCart = async () => {
    try {
      const { access_token } = parseCookies();

      if (!access_token) {
        alert('Chưa đăng nhập!');
        return;
      }

      // Giải mã JWT để lấy userId
      const { payload } = await jwtVerify(access_token, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET));
      const userId = payload.userId;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/cart/getCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();

      if (data.success) {
        setCartItems(data.data.products.map(p => ({
          id: p.product_id._id,
          name: p.product_id.name,
          description: p.product_id.shortDescription,
          price: p.product_id.price,
          oldPrice: p.oldPrice || p.price + 10,
          quantity: p.quantity,
          image: p.product_id.image_url
        })));
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increaseQty = (id) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const handleAddToCart = async (productId) => {
    try {
      const { access_token } = parseCookies();

      if (!access_token) {
        alert('Chưa đăng nhập!');
        return;
      }

      // Giải mã JWT để lấy userId
      const { payload } = await jwtVerify(access_token, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET));
      const userId = payload.userId;
      // Gửi request tới BE
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/cart/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Thêm sản phẩm vào giỏ hàng thành công!', {
          duration: 500,
        });
      } else {
        toast.error(data.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng!', {
          duration: 500,
        });
      }
    } catch (err) {
      console.error(err);
      alert('Token lỗi hoặc hết hạn!');
    }
  };

  const handleDecreaseQty = async (productId) => {
    try {
      const { access_token } = parseCookies();

      if (!access_token) {
        alert('Chưa đăng nhập!');
        return;
      }

      const { payload } = await jwtVerify(
        access_token,
        new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
      );
      const userId = payload.userId;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/cart/decrease`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Xoá sản phẩm khỏi giỏ hàng thành công!', {
          duration: 500,
        });
      } else {
        toast.error(data.message || 'Lỗi khi xoá sản phẩm khỏi giỏ hàng!', {
          duration: 500,
        });
      }

    } catch (err) {
      console.error(err);
      alert('Token lỗi hoặc hết hạn!');
    }
  };

  const handleDeleteItem = async (productId) => {
    try {
      const { access_token } = parseCookies();

      if (!access_token) {
        alert('Chưa đăng nhập!');
        return;
      }

      const { payload } = await jwtVerify(
        access_token,
        new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
      );
      const userId = payload.userId;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/cart`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await res.json();

      if (data.success) {
        setCartItems((items) => items.filter(item => item.id !== productId));
        toast.success('Xoá sản phẩm khỏi giỏ hàng thành công!', {
          duration: 1000,
        });
        fetchCart();
      } else {
        toast.error(data.message || 'Lỗi khi xoá sản phẩm!', {
          duration: 1000,
        });
      }

    } catch (err) {
      console.error(err);
      alert('Token lỗi hoặc hết hạn!');
    }
  };


  if (loading) return <p>Loading...</p>;

  return (
    <div
      className="min-h-screen bg-cover bg-center px-4 py-10 flex justify-center"
      style={{ backgroundImage: "url('/background/BG5.png')" }}
    >
      <div className="w-full max-w-7xl bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl flex flex-col lg:flex-row gap-10">

        {/* Cart Items - Scrollable if more than 4 */}
        <div className="flex-1 space-y-6 overflow-y-auto" style={{ maxHeight: '910px' }}>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center gap-6">
                <img src={`${process.env.NEXT_PUBLIC_API_URL}productImg/${item.image?.[0]}`} alt={item.name} className="w-40 h-40 object-contain" />
                <div>
                  <p className="text-lg font-semibold leading-snug">{item.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Estimate Delivery: <span className="text-black font-medium">3-5 days</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center border rounded-md px-3 py-1 text-sm">
                  <button
                    onClick={() => {
                      if (item.quantity <= 1) {
                        handleDeleteItem(item.id);
                      } else {
                        handleDecreaseQty(item.id);
                        decreaseQty(item.id);
                      }
                    }}
                    className="px-2 text-sm"
                  >
                    −
                  </button>
                  <span className="px-3 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => {
                      handleAddToCart(item.id);
                      increaseQty(item.id);
                    }}
                    className="px-2 text-sm"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">£{(item.price * item.quantity).toFixed(2)}</p>
                  {/* <p className="line-through text-red-400 text-sm">£{item.oldPrice}</p> */}
                </div>
                <button onClick={() => handleDeleteItem(item.id)} className="text-2xl text-gray-500 hover:text-red-500">×</button>
              </div>
            </div>
          ))}

          {cartItems.length === 0 && (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[480px] bg-white p-8 rounded-lg shadow-lg space-y-5">
          <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
          {/* Product List with Price */}
          <div className="space-y-1 border-b pb-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Items in your cart:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>£{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between text-sm">
            <span>Subtotal ({cartItems.length} items):</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery:</span>
            <span>£{deliveryFee}</span>
          </div>

          <div className="flex items-center mt-2">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md text-sm"
            />
            <button className="bg-gray-300 px-4 py-2 text-sm rounded-r-md hover:bg-gray-400">Apply</button>
          </div>

          <div className="flex justify-between mt-4 text-lg font-semibold">
            <span>Total:</span>
            <span>£{total.toFixed(2)}</span>
          </div>

          <button className="w-full bg-black text-white py-3 rounded-md text-base hover:opacity-90 transition">
            Proceed to Checkout
          </button>

          <button className="w-full flex items-center justify-center border border-gray-400 rounded-md py-3 hover:bg-gray-100 transition">
            <img src="/image/vnpay-logo.png" alt="VNpay" className="h-8 w-8 mr-3" />
            <span className="text-base">VNpay</span>
          </button>
        </div>

      </div>
    </div>
  );
}
