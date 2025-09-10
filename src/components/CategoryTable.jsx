'use client';

import DataTable from 'react-data-table-component';
import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { parseCookies } from 'nookies';
import { toast, Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

const removeVietnameseTones = (str) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');

export default function CategoryTable({ searchText }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/category/`);
            const resData = await res.json();
            setCategories(Array.isArray(resData.data) ? resData.data : []);
        } catch (err) {
            console.error('Lỗi khi fetch:', err);
            toast.error('Lấy danh sách thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn xoá danh mục này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ'
        });

        if (!result.isConfirmed) return;

        try {
            const cookies = parseCookies();
            if (!cookies.access_token) {
                toast.error('Chưa đăng nhập');
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/category/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.access_token}`
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Xoá thất bại');

            toast.success(data.message || 'Xoá danh mục thành công');
            fetchCategories(); // reload
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Xoá thất bại');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filtered = useMemo(() => {
        return categories.filter(item =>
            removeVietnameseTones(item.name.toLowerCase()).includes(removeVietnameseTones(searchText.toLowerCase())) ||
            removeVietnameseTones(item.description?.toLowerCase() || '').includes(removeVietnameseTones(searchText.toLowerCase()))
        );
    }, [categories, searchText]);

    const columns = [
        { name: 'Tên danh mục', selector: row => row.name, sortable: true },
        { name: 'Mô tả', selector: row => row.description, sortable: false },
        {
            name: 'Ẩn',
            selector: row => row.isHide,
            cell: row => (
                <p className={`px-2 py-1 rounded text-white text-sm font-medium ${row.isHide ? 'bg-red-500' : 'bg-green-500'}`}>
                    {row.isHide ? 'True' : 'False'}
                </p>
            ),
            sortable: true
        },
        {
            name: 'Hành động',
            cell: row => (
                <div className="space-x-2">
                    <button
                        className="text-red-600 hover:underline"
                        onClick={(e) => { e.stopPropagation(); handleDelete(row._id); }}
                    >
                        Xoá
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="space-y-4">
                <div className="flex justify-end">
                    <Link
                        href="/admin/category/add"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        + Thêm danh mục
                    </Link>
                </div>
                <DataTable
                    columns={columns}
                    data={filtered}
                    pagination
                    highlightOnHover
                    responsive
                    progressPending={loading}
                    persistTableHead
                    pointerOnHover
                    onRowClicked={row => router.push(`/admin/category/${row._id}`)}
                    customStyles={{
                        rows: { style: { cursor: 'pointer' } }
                    }}
                />
            </div>
        </>
    );
}
