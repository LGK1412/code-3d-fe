'use client';
import { deleteCookie } from 'cookies-next';

export default function AdminNavbar() {
    const handleLogout = () => {
        deleteCookie('access_token'); // Xoá cookie
        window.location.href = '/login'; // Chuyển trang
    };
    
    return (
        <div className="flex justify-between items-center mb-6">
            <a href="/admin/dashboard"><h1 className="text-3xl font-bold">Admin Dashboard</h1></a>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Đăng xuất
            </button>
        </div>
    );
}
