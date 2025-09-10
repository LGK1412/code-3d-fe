'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminTab } from '@/context/AdminTabContext';
import { parseCookies } from 'nookies';

export default function EditGroupPage() {
    const { id } = useParams();
    const router = useRouter();

    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]); // tất cả category
    const [selectedCategories, setSelectedCategories] = useState([]); // category của group
    const [isHide, setIsHide] = useState(false);
    const [loading, setLoading] = useState(true);
    const { setActiveTab } = useAdminTab();

    // Lấy danh sách category & group
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [groupRes, categoryRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}api/group/${id}`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}api/category`)
                ]);

                const groupData = await groupRes.json();
                const categoryData = await categoryRes.json();

                if (!groupRes.ok) throw new Error(groupData.message || 'Lỗi fetch group');
                if (!categoryRes.ok) throw new Error(categoryData.message || 'Lỗi fetch category');

                setName(groupData.data.name || '');
                setSelectedCategories(groupData.data.category?.map(c => c._id) || []);
                setIsHide(groupData.data.isHide || false);
                setCategories(categoryData.data || []);
            } catch (err) {
                alert(err.message);
                setActiveTab('groups');
                router.push('/admin/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const cookies = parseCookies();
            if (!cookies.access_token) {
                alert('Chưa đăng nhập');
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/group/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cookies.access_token}` },
                body: JSON.stringify({
                    name: name.trim(),
                    category: selectedCategories,
                    isHide
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Lỗi cập nhật');

            alert('Cập nhật thành công!');
            setActiveTab('groups');
            router.push('/admin/dashboard');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bạn có chắc chắn muốn xoá group này?')) return;
        try {
            const cookies = parseCookies();
            if (!cookies.access_token) {
                alert('Chưa đăng nhập');
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/group/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cookies.access_token}` },
            });

            const data = await res.json();

            alert(data.message);
            router.push('/admin/dashboard');
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <p className="text-center mt-10">Đang tải...</p>;

    return (
        <div className="max-w-md mx-auto mt-10 space-y-4">
            <h1 className="text-2xl font-bold">Cập nhật group</h1>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block font-medium">Tên group</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2 text-gray-700">Category</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {categories.map(cat => (
                            <label
                                key={cat._id}
                                className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition"
                            >
                                <input
                                    type="checkbox"
                                    value={cat._id}
                                    checked={selectedCategories.includes(cat._id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedCategories([...selectedCategories, cat._id]);
                                        } else {
                                            setSelectedCategories(selectedCategories.filter(id => id !== cat._id));
                                        }
                                    }}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-800">{cat.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isHide}
                        onChange={e => setIsHide(e.target.checked)}
                        id="isHide"
                    />
                    <label htmlFor="isHide">Ẩn group</label>
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
