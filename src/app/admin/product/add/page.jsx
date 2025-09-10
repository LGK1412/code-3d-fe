'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import CheckboxGroup from '@/components/CheckBoxGroup';
import { useAdminTab } from '@/context/AdminTabContext';
import { parseCookies } from 'nookies';

export default function AddProductPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        description: [{ name: '', infor: '' }],
        image_url: [],
        menh_main: '',
        menh_good: [],
        menh_bad: [],
        huong_good: [],
        huong_bad: [],
        color_good: [],
        color_bad: [],
        isHide: false,
        inStock: false,
        quantity: 0,
        price: 0,
        color_main: '',
        category: '',
        shortDescription: '',
        style: '',
    });
    const [images, setImages] = useState([]);
    const [modelFile, setModelFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [styles, setStyles] = useState([]);
    const { setActiveTab } = useAdminTab();

    const MENH_OPTIONS = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
    const HUONG_OPTIONS = ['Đông', 'Tây', 'Nam', 'Bắc'];

    const isFormValid = () => {
        if (!form.name.trim()) return false;
        if (!form.category.trim()) return false;

        if (
            !Array.isArray(form.description) ||
            form.description.length === 0 ||
            !form.description.every(d => d.name.trim() && d.infor.trim())
        ) return false;

        // Validate arrays: must have at least 1 value
        const requiredArrays = ['menh_good', 'menh_bad', 'huong_good', 'huong_bad', 'color_good', 'color_bad'];
        for (const key of requiredArrays) {
            if (!Array.isArray(form[key]) || form[key].length === 0) return false;
        }

        // Validate quantity and price
        if (form.quantity <= 0 || form.price <= 0) return false;

        return true;
    };

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const handleArrayChange = (field, index, value) => {
        const updated = [...form[field]];
        updated[index] = value;
        setForm({ ...form, [field]: updated });
    };

    const handleDescriptionChange = (index, key, value) => {
        const updated = [...form.description];
        updated[index][key] = value;
        setForm({ ...form, description: updated });
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 10) return alert('Tối đa 10 ảnh');
        for (let file of files) {
            if (file.size > 5 * 1024 * 1024) return alert('Mỗi ảnh tối đa 5MB');
        }
        setImages(files);
    };

    const handleModelChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'model/gltf-binary' && !file.name.endsWith('.glb'))
            return alert('Chỉ hỗ trợ file .glb');
        if (file.size > 100 * 1024 * 1024) return alert('Model tối đa 100MB');
        setModelFile(file);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/category/notHide`);
                const data = await res.json();
                setCategories(data.data);
            } catch (err) {
                console.error('Lỗi khi load category', err);
            }
        };
        fetchCategories();

        const fetchStyles = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/style/notHide`);
                const data = await res.json();
                setStyles(data.data);
            } catch (err) {
                console.error('Lỗi khi load style', err);
            }
        };
        fetchStyles();
    }, []);

    const handleAdd = async () => {
        if (!isFormValid()) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            const fd = new FormData();
            fd.append('name', form.name);
            fd.append('description', JSON.stringify(form.description));
            fd.append('menh_good', JSON.stringify(form.menh_good));
            fd.append('menh_bad', JSON.stringify(form.menh_bad));
            fd.append('huong_good', JSON.stringify(form.huong_good));
            fd.append('huong_bad', JSON.stringify(form.huong_bad));
            fd.append('color_good', JSON.stringify(form.color_good));
            fd.append('color_bad', JSON.stringify(form.color_bad));
            fd.append('isHide', form.isHide.toString());
            fd.append('inStock', form.inStock.toString());
            fd.append('quantity', form.quantity.toString());
            fd.append('price', form.price.toString());
            fd.append('menh_main', form.menh_main.toString());
            fd.append('color_main', form.color_main.toString());
            fd.append('category', form.category.toString());
            fd.append('shortDescription', form.shortDescription.toString());
            fd.append('style', form.style.toString())

            images.forEach((img) => fd.append('images', img));
            if (modelFile) fd.append('model', modelFile);

            const cookies = parseCookies();
            if (!cookies.access_token) {
                alert('Chưa đăng nhập');
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/product`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${cookies.access_token}` },
                body: fd,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            alert(data.message);
            setActiveTab('products');
            router.push('/admin/dashboard');
        } catch (err) {
            console.error(err);
            alert('Lỗi khi thêm sản phẩm');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <AdminNavbar />
            <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Thêm sản phẩm mới</h1>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">Tên sản phẩm</label>
                    <input
                        maxLength={300}
                        className="w-full border p-2 rounded"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">Mô tả ngắn</label>
                    <input
                        maxLength={300}
                        className="w-full border p-2 rounded"
                        value={form.shortDescription}
                        onChange={(e) => handleChange('shortDescription', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">File Model (.glb)</label>
                    <label className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
                        Chọn file model
                        <input
                            type="file"
                            accept=".glb"
                            onChange={handleModelChange}
                            className="hidden"
                        />
                    </label>
                    {modelFile && <p className="mt-1 text-sm text-gray-700">{modelFile.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Ảnh sản phẩm (tối đa 10 ảnh)</label>
                    <label className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
                        Chọn ảnh
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                            className="hidden"
                        />
                    </label>
                    {images.length > 0 && (
                        <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
                            {images.map((img, i) => (
                                <li key={i}>{img.name}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <h2 className="font-semibold text-lg text-gray-700 mb-2">Mô tả</h2>
                    {form.description.map((desc, i) => (
                        <div key={i} className="flex gap-4 mb-2 items-center">
                            <p className="flex-shrink-0 w-32">{`Mô tả số ${i + 1}`}</p>
                            <input
                                maxLength={300}
                                className="border p-2 rounded w-1/3"
                                value={desc.name}
                                onChange={(e) => handleDescriptionChange(i, 'name', e.target.value)}
                                placeholder="Tên mô tả"
                            />
                            <input
                                maxLength={300}
                                className="border p-2 rounded w-2/3"
                                value={desc.infor}
                                onChange={(e) => handleDescriptionChange(i, 'infor', e.target.value)}
                                placeholder="Thông tin"
                            />
                            <button
                                onClick={() => {
                                    const updated = [...form.description];
                                    updated.splice(i, 1);
                                    setForm({ ...form, description: updated });
                                }}
                                className="text-red-500"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() =>
                            setForm({ ...form, description: [...form.description, { name: '', infor: '' }] })
                        }
                        className="text-blue-600 mt-2"
                    >
                        + Thêm mô tả
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Category: </label>
                    <select
                        className="border p-2 rounded w-full"
                        value={form.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        required
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Styles: </label>
                    <select
                        className="border p-2 rounded w-full"
                        value={form.style}
                        onChange={(e) => handleChange('style', e.target.value)}
                        required
                    >
                        <option value="">-- Chọn style --</option>
                        {styles.map((style) => (
                            <option key={style._id} value={style._id}>
                                {style.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="font-semibold text-gray-700 capitalize mb-1">Mệnh chính</label>
                    <div className="flex flex-wrap gap-4">
                        {MENH_OPTIONS.map((option) => (
                            <label
                                key={option}
                                className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition
                                        ${form.menh_main === option
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}
                            >
                                <input
                                    type="radio"
                                    name="menh_main"
                                    value={option}
                                    checked={form.menh_main === option}
                                    onChange={(e) => handleChange('menh_main', e.target.value)}
                                    className="hidden"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>

                <CheckboxGroup
                    label="Mệnh tốt"
                    options={MENH_OPTIONS}
                    selected={form.menh_good}
                    exclude={form.menh_bad}
                    onChange={(val) => setForm({ ...form, menh_good: val })}
                />

                <CheckboxGroup
                    label="Mệnh xấu"
                    options={MENH_OPTIONS}
                    selected={form.menh_bad}
                    exclude={form.menh_good}
                    onChange={(val) => setForm({ ...form, menh_bad: val })}
                />

                <CheckboxGroup
                    label="Hướng tốt"
                    options={HUONG_OPTIONS}
                    selected={form.huong_good}
                    exclude={form.huong_bad}
                    onChange={(val) => setForm({ ...form, huong_good: val })}
                />

                <CheckboxGroup
                    label="Hướng xấu"
                    options={HUONG_OPTIONS}
                    selected={form.huong_bad}
                    exclude={form.huong_good}
                    onChange={(val) => setForm({ ...form, huong_bad: val })}
                />

                <div className="mb-4">
                    <label className="font-semibold text-gray-700 capitalize mb-1">Màu chính</label>
                    <input
                        type="text"
                        value={form.color_main}
                        onChange={(e) => handleChange('color_main', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập màu chính"
                    />
                </div>

                {[
                    'color_good',
                    'color_bad',
                ].map((field) => (
                    <div key={field}>
                        <h2 className="font-semibold text-gray-700 capitalize mb-1">
                            {field.replace(/_/g, ' ')}
                        </h2>
                        {form[field].map((item, idx) => (
                            <div key={idx} className="flex gap-2 mb-2 items-center">
                                <p className="flex-shrink-0 w-32">{`Tên màu số: ${idx + 1}`}</p>
                                <input
                                    className="border p-2 w-full rounded"
                                    value={item}
                                    onChange={(e) => handleArrayChange(field, idx, e.target.value)}
                                    placeholder="Tên màu"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (confirm('Xoá mục này?')) {
                                            const updated = [...form[field]];
                                            updated.splice(idx, 1);
                                            setForm({ ...form, [field]: updated });
                                        }
                                    }}
                                    className="text-red-500 font-bold px-2"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => setForm({ ...form, [field]: [...form[field], ''] })}
                            className="text-blue-600 mt-1"
                        >
                            + Thêm
                        </button>
                    </div>
                ))}
                <div className="space-y-4">
                    <div>
                        <label className="inline-flex items-center gap-2 text-gray-700">
                            <input
                                type="checkbox"
                                checked={form.isHide}
                                onChange={(e) => setForm({ ...form, isHide: e.target.checked })}
                                className="form-checkbox h-5 w-5"
                            />
                            Ẩn sản phẩm
                        </label>
                    </div>

                    <div>
                        <label className="inline-flex items-center gap-2 text-gray-700">
                            <input
                                type="checkbox"
                                checked={form.inStock}
                                onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                                className="form-checkbox h-5 w-5"
                            />
                            Còn hàng
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Số lượng</label>
                        <input
                            type="number"
                            min={0}
                            value={form.quantity}
                            onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value || '0') })}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Giá</label>
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value || '0') })}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleAdd}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
                    >
                        Thêm sản phẩm
                    </button>
                </div>
            </div>
        </div>
    );
}
