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

export default function ProductTable({ searchText }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/product/`);
            const resData = await res.json();
            setProducts(Array.isArray(resData.data) ? resData.data : []);
        } catch (err) {
            console.error('Lỗi khi fetch:', err);
            toast.error('Lỗi khi tải sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn xoá sản phẩm này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ'
        });

        if (result.isConfirmed) {
            try {
                const cookies = parseCookies();
                if (!cookies.access_token) {
                    toast.error('Chưa đăng nhập');
                    return;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/product/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${cookies.access_token}`
                    },
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Lỗi xoá sản phẩm');

                toast.success(data.message || 'Xoá sản phẩm thành công');
                fetchProducts(); // reload table
            } catch (err) {
                console.error(err);
                toast.error('Xoá thất bại');
            }
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filtered = useMemo(() => {
        return products.filter(item =>
            removeVietnameseTones(item.name.toLowerCase()).includes(removeVietnameseTones(searchText.toLowerCase())) ||
            removeVietnameseTones(item.model_name.toLowerCase()).includes(removeVietnameseTones(searchText.toLowerCase()))
        );
    }, [products, searchText]);

    const columns = [
        { name: 'Tên', selector: row => row.name, sortable: true },
        { name: 'Model', selector: row => row.model_name, sortable: true },
        { name: 'Mệnh chính', selector: row => row.menh_main, sortable: true },
        { name: 'Màu chính', selector: row => row.color_main, sortable: true },
        { name: 'Category', selector: row => row.category?.name, sortable: true },
        { name: 'Số lượng', selector: row => row.quantity, sortable: true },
        { name: 'Giá', selector: row => row.price, cell: row => `${row.price}$`, sortable: true },
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
            name: 'Còn hàng',
            selector: row => row.inStock,
            cell: row => (
                <p className={`px-2 py-1 rounded text-white text-sm font-medium ${row.inStock ? 'bg-green-500' : 'bg-red-500'}`}>
                    {row.inStock ? 'True' : 'False'}
                </p>
            ),
            sortable: true
        },
        {
            name: 'Hành động',
            cell: row => <button className="text-red-500 hover:underline" onClick={() => handleDelete(row._id)}>Xoá</button>
        }
    ];

    return (
        <div className="space-y-4">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="flex justify-end">
                <Link
                    href="/admin/product/add"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    + Thêm sản phẩm
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
                onRowClicked={row => router.push(`/admin/product/${row._id}`)}
                customStyles={{
                    rows: {
                        style: {
                            cursor: 'pointer'
                        }
                    }
                }}
            />
        </div>
    );
}
