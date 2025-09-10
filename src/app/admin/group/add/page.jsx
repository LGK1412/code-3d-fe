'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminTab } from '@/context/AdminTabContext';
import { parseCookies } from 'nookies';

export default function AddGroupPage() {
    const [name, setName] = useState('');
    const [isHide, setIsHide] = useState(false);
    const [categories, setCategories] = useState([]); // danh sách category để chọn
    const [selectedCategories, setSelectedCategories] = useState([]); // id các category được chọn

    const router = useRouter();
    const { setActiveTab } = useAdminTab();

    // Lấy tất cả category (không ẩn) để chọn
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/category/notHide`);
                const data = await res.json();
                if (res.ok) setCategories(data.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const cookies = parseCookies();
            if (!cookies.access_token) {
                alert('Chưa đăng nhập');
                return;
            }
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/group/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cookies.access_token}` },
                body: JSON.stringify({
                    name,
                    isHide,
                    category: selectedCategories
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Lỗi thêm group');

            alert('Thêm group thành công!');
            setActiveTab('groups');
            router.push('/admin/dashboard');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCategoryChange = (id) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
        );
    };

    return (
        <div className="max-w-md mx-auto mt-10 space-y-4">
            <h1 className="text-2xl font-bold">Thêm nhóm</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Tên nhóm</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isHide}
                        onChange={e => setIsHide(e.target.checked)}
                        id="isHide"
                    />
                    <label htmlFor="isHide">Ẩn nhóm</label>
                </div>

                <div>
                    <label className="block font-medium mb-2">Chọn danh mục</label>
                    <div className="space-y-1">
                        {categories.map(cat => (
                            <div key={cat._id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`cat- ${cat._id}`}
                                    checked={selectedCategories.includes(cat._id)}
                                    onChange={() => handleCategoryChange(cat._id)}
                                />
                                <label htmlFor={`cat - ${cat._id}`}>{cat.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Thêm
                </button>
            </form>
        </div>
    );
}
