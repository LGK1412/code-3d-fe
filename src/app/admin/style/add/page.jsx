'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminTab } from '@/context/AdminTabContext';
import { parseCookies } from 'nookies';

export default function AddStylePage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isHide, setIsHide] = useState(false);
    const router = useRouter();
    const { setActiveTab } = useAdminTab();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const trimmedName = name.trim();
            const trimmedDescription = description.trim();

            const cookies = parseCookies();
            if (!cookies.access_token) {
                alert('Chưa đăng nhập');
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/style/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cookies.access_token}` },
                body: JSON.stringify({
                    name: trimmedName,
                    description: trimmedDescription,
                    isHide
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Lỗi thêm style');

            alert('Thêm style thành công!');
            setActiveTab('styles');
            router.push('/admin/dashboard');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 space-y-4">
            <h1 className="text-2xl font-bold">Thêm style</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Tên style</label>
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
                    <label htmlFor="isHide">Ẩn style</label>
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Thêm
                </button>
            </form>
        </div>
    );
}
