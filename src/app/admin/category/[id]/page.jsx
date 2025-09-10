'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminTab } from '@/context/AdminTabContext';
import { parseCookies } from "nookies";

export default function EditCategoryPage() {
    const { id } = useParams();
    const router = useRouter();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isHide, setIsHide] = useState(false);
    const [loading, setLoading] = useState(true);
    const { setActiveTab } = useAdminTab();

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/category/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Lỗi fetch');
                console.log(data)

                setName(data.data.name || '');
                setDescription(data.data.description || '');
                setIsHide(data.data.isHide || false);
            } catch (err) {
                alert('Không tìm thấy danh mục!');
                setActiveTab('categories');
                router.push('/admin/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id, router]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const cookies = parseCookies();
            if (!cookies.access_token) {
                alert('Chưa đăng nhập');
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/category/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`
                },
                body: JSON.stringify({ name, description, isHide })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Lỗi cập nhật');

            alert('Cập nhật thành công!');
            setActiveTab('categories');
            router.push('/admin/dashboard');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bạn có chắc chắn muốn xoá danh mục này?')) return;

        const cookies = parseCookies();
        if (!cookies.access_token) {
            alert('Chưa đăng nhập');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/category/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Lỗi xoá');

            alert('Xoá thành công!');
            router.push('/admin/category');
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <p className="text-center mt-10">Đang tải...</p>;

    return (
        <div className="max-w-md mx-auto mt-10 space-y-4">
            <h1 className="text-2xl font-bold">Cập nhật danh mục</h1>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block font-medium">Tên danh mục</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">Mô tả</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isHide}
                        onChange={e => setIsHide(e.target.checked)}
                        id="isHide"
                    />
                    <label htmlFor="isHide">Ẩn danh mục</label>
                </div>

                <div className="flex space-x-4">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Cập nhật
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Xoá
                    </button>
                </div>
            </form>
        </div>
    );
}
