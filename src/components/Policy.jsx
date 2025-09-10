'use client';

import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { toast, Toaster } from 'react-hot-toast';
import { parseCookies } from "nookies";

export default function PolicyEditor() {
    const editorRef = useRef(null);
    const toolbarRef = useRef(null);
    const [editor, setEditor] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchPolicy = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/policy/`);
                const data = await res.json();
                const content = data?.data[0]?.content || '';

                if (editorRef.current) {
                    const quill = new Quill(editorRef.current, {
                        theme: 'snow',
                        modules: { toolbar: toolbarRef.current },
                        placeholder: 'Viết nội dung ở đây...'
                    });

                    quill.root.innerHTML = content; // set content từ DB
                    setEditor(quill);
                }
            } catch (err) {
                console.error(err);
                toast.error(err.message || 'Lỗi khi lấy policy');
            } finally {
                setLoading(false);
            }
        };

        fetchPolicy();
    }, []);

    const handleSave = async () => {
        if (!editor) return;
        const content = editor.root.innerHTML;

        try {
            const cookies = parseCookies();
            if (!cookies.access_token) {
                alert('Chưa đăng nhập');
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/policy/update`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cookies.access_token}` },
                body: JSON.stringify({ content })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message || 'Cập nhật policy thành công!');
            } else {
                toast.error(data.message || 'Cập nhật thất bại!');
            }
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi cập nhật policy');
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4 bg-gray-50 rounded">
            <Toaster position="top-right" reverseOrder={false} />

            {/* Toolbar riêng */}
            <div ref={toolbarRef} className="mb-2">
                <button className="ql-bold" />
                <button className="ql-italic" />
                <button className="ql-underline" />
            </div>

            <div ref={editorRef} style={{ height: '300px', backgroundColor: 'white' }} />
            <button
                onClick={handleSave}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                Cập nhật Policy
            </button>
        </div>
    );
}
