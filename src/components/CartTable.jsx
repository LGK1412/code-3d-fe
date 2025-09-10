'use client';

import DataTable from 'react-data-table-component';
import { useMemo, useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CartTable({ searchText }) {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchCarts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/cart/`, {
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();

            if (!Array.isArray(data.data)) throw new Error('Dữ liệu không hợp lệ');

            const mappedCarts = data.data.map(cart => ({
                _id: cart._id || '',
                customer_id: cart.customer_id?._id || '',
                customer_name: cart.customer_id?.name || '',
                products: Array.isArray(cart.products)
                    ? cart.products.map(p => ({
                        product_id: p.product_id?._id || '',
                        product_name: p.product_id?.name || '',
                        quantity: p.quantity || 1
                    }))
                    : [],
                total_products: Array.isArray(cart.products)
                    ? cart.products.reduce((sum, p) => sum + (p.quantity || 0), 0)
                    : 0
            }));

            setCarts(mappedCarts);
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Lỗi khi lấy giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCarts();
    }, []);

    const filtered = useMemo(() => {
        return carts.filter(cart =>
            cart.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
            cart.customer_id.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [carts, searchText]);

    const columns = [
        { name: 'Cart ID', selector: row => row._id, sortable: true },
        { name: 'Customer ID', selector: row => row.customer_id, sortable: true },
        { name: 'Customer Name', selector: row => row.customer_name, sortable: true },
        { name: 'Products', selector: row => row.total_products, sortable: true },
    ];

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <DataTable
                columns={columns}
                data={filtered}
                pagination
                highlightOnHover
                responsive
                progressPending={loading}
                persistTableHead
                onRowClicked={row => router.push(`/admin/cart/${row._id}`)}
            />
        </>
    );
}
