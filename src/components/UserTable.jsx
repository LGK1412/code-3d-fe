'use client';

import DataTable from 'react-data-table-component';
import { useMemo, useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const removeVietnameseTones = (str) =>
  str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D') || '';

export default function UserTable({ searchText }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/user/`, {
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (!Array.isArray(data.data)) throw new Error('Dữ liệu không hợp lệ');

      // Map lại để đảm bảo có đủ 6 trường
      const mappedUsers = data.data.map(u => ({
        email: u.email || '',
        name: u.name || '',
        role: u.role || '',
        gender: u.gender || '',
        dob: u.dob || '',
        menh: u.menh || '',
        _id: u._id || ''
      }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Lỗi khi lấy người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    return users.filter(item =>
      removeVietnameseTones(item.name.toLowerCase()).includes(removeVietnameseTones(searchText.toLowerCase())) ||
      removeVietnameseTones(item.email.toLowerCase()).includes(removeVietnameseTones(searchText.toLowerCase())) ||
      removeVietnameseTones(item.role.toLowerCase()).includes(removeVietnameseTones(searchText.toLowerCase())) ||
      removeVietnameseTones(item._id.toLowerCase()).includes(removeVietnameseTones(searchText.toLowerCase()))
    );
  }, [users, searchText]);

  const columns = [
    { name: 'Id', selector: row => row._id, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Role', selector: row => row.role, sortable: true },
    { name: 'Gender', selector: row => row.gender, sortable: true },
    { name: 'Date of Birth', selector: row => row.dob, sortable: true },
    { name: 'Mệnh', selector: row => row.menh, sortable: true },
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
      />
    </>
  );
}
