'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { useAdminTab } from '@/context/AdminTabContext';

const ProductTable = dynamic(() => import('@/components/ProductTable'), { ssr: false });
const UserTable = dynamic(() => import('@/components/UserTable'), { ssr: false });
const CategoryTable = dynamic(() => import('@/components/CategoryTable'), { ssr: false });
const GroupTable = dynamic(() => import('@/components/GroupTable'), { ssr: false })
const StyleGroup = dynamic(() => import('@/components/StyleTable'), { ssr: false })
const CartTable = dynamic(() => import('@/components/CartTable'), { ssr: false })
const Policy = dynamic(() => import('@/components/Policy'), { ssr: false })

export default function AdminDashboard() {
    const { activeTab, setActiveTab } = useAdminTab();
    const [searchText, setSearchText] = useState('');

    const getHeaderTitle = () => {
        switch (activeTab) {
            case 'products': return 'Danh sách sản phẩm';
            case 'users': return 'Danh sách người dùng';
            case 'categories': return 'Danh sách danh mục';
            case 'groups': return 'Danh sách nhóm';
            case 'styles': return 'Danh sách kiểu';
            case 'cart': return 'Danh sách giỏ hàng';
            case 'policy': return 'Policy';
            default: return '';
        }
    };

    const showSearch = ['products', 'users', 'categories', 'groups', 'styles', 'cart'].includes(activeTab);

    const customHeader = (
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">{getHeaderTitle()}</h2>
            {showSearch && (
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            )}
        </div>
    );

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <AdminNavbar />

            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => { setActiveTab('products'); setSearchText(''); }}
                    className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                >
                    Product
                </button>
                <button
                    onClick={() => { setActiveTab('users'); setSearchText(''); }}
                    className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                >
                    Users
                </button>
                <button
                    onClick={() => { setActiveTab('categories'); setSearchText(''); }}
                    className={`px-4 py-2 rounded ${activeTab === 'categories' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                >
                    Category
                </button>
                <button
                    onClick={() => { setActiveTab('groups'); setSearchText(''); }}
                    className={`px-4 py-2 rounded ${activeTab === 'groups' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                >
                    Group Category
                </button>
                <button
                    onClick={() => { setActiveTab('styles'); setSearchText(''); }}
                    className={`px-4 py-2 rounded ${activeTab === 'styles' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                >
                    Style
                </button>
                <button
                    onClick={() => { setActiveTab('cart'); setSearchText(''); }}
                    className={`px-4 py-2 rounded ${activeTab === 'cart' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                >
                    Cart
                </button>
                <button
                    onClick={() => { setActiveTab('policy'); }}
                    className={`px-4 py-2 rounded ${activeTab === 'policy' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                >
                    Policy
                </button>
            </div>

            <div className="bg-white p-4 rounded shadow">
                {customHeader}
                {activeTab === 'products' && <ProductTable searchText={searchText} />}
                {activeTab === 'users' && <UserTable searchText={searchText} />}
                {activeTab === 'categories' && <CategoryTable searchText={searchText} />}
                {activeTab === 'groups' && <GroupTable searchText={searchText} />}
                {activeTab === 'styles' && <StyleGroup searchText={searchText} />}
                {activeTab === 'cart' && <CartTable searchText={searchText} />}
                {activeTab === 'policy' && <Policy />}
            </div>

        </div>
    );
}
