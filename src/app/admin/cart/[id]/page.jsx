'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

export default function CartShow() {
    const { id: cartId } = useParams();
    const router = useRouter();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/cart/${cartId}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (!data?.data) throw new Error('Không tìm thấy cart');
            setCart(data.data);
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Lỗi khi lấy thông tin giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cartId) fetchCart();
    }, [cartId]);

    if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
    if (!cart) return <p className="text-center mt-10 text-red-500">Cart không tồn tại</p>;

    const customer = cart.customer_id || {};

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="max-w-4xl mx-auto p-6 space-y-6">

                {/* Back button */}
                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    onClick={() => router.push('/admin/dashboard')}
                >
                    &larr; Back to Dashboard
                </button>

                {/* Cart Info */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-indigo-600">Cart Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p><span className="font-semibold text-gray-700">Cart ID:</span> {cart._id}</p>
                            <p><span className="font-semibold text-gray-700">Created At:</span> {new Date(cart.createdAt).toLocaleString()}</p>
                            <p><span className="font-semibold text-gray-700">Updated At:</span> {new Date(cart.updatedAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <p><span className="font-semibold text-gray-700">Customer ID:</span> {customer._id || '—'}</p>
                            <p><span className="font-semibold text-gray-700">Name:</span> {customer.name || '—'}</p>
                            <p><span className="font-semibold text-gray-700">Email:</span> {customer.email || '—'}</p>
                            <p><span className="font-semibold text-gray-700">Role:</span> {customer.role || '—'}</p>
                            <p><span className="font-semibold text-gray-700">Gender:</span> {customer.gender || '—'}</p>
                            <p><span className="font-semibold text-gray-700">Date of Birth:</span> {customer.dob || '—'}</p>
                            <p><span className="font-semibold text-gray-700">Mệnh:</span> {customer.menh || '—'}</p>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 text-indigo-600">Products ({cart.products.length})</h3>
                    {cart.products.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200">
                                <thead className="bg-indigo-50">
                                    <tr>
                                        <th className="py-2 px-3 border-b text-left">#</th>
                                        <th className="py-2 px-3 border-b text-left">Product ID</th>
                                        <th className="py-2 px-3 border-b text-left">Name</th>
                                        <th className="py-2 px-3 border-b text-left">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.products.map((p, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="py-2 px-3 border-b">{idx + 1}</td>
                                            <td className="py-2 px-3 border-b">{p.product_id?._id || '—'}</td>
                                            <td className="py-2 px-3 border-b">{p.product_id?.name || '—'}</td>
                                            <td className="py-2 px-3 border-b">{p.quantity || 1}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">Không có sản phẩm trong giỏ</p>
                    )}
                </div>
            </div>
        </>
    );
}
