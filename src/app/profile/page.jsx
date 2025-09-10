"use client";

import { useState, useEffect } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import * as jose from "jose";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [formData, setFormData] = useState({});
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const cookies = parseCookies();
        if (!cookies.access_token) {
            setLoading(false);
            return;
        }

        try {
            const decoded = jose.decodeJwt(cookies.access_token);
            console.log(decoded);

            setUserId(decoded.userId);

            // Nếu dob đã ở dạng yyyy-MM-dd thì gán luôn
            let dobFormatted = "";
            if (decoded.dob) {
                if (decoded.dob.includes("-")) {
                    const parts = decoded.dob.split("-");
                    if (parts[0].length === 4) {
                        dobFormatted = decoded.dob;
                    } else {
                        const [day, month, year] = decoded.dob.split("-");
                        dobFormatted = `${year}-${month}-${day}`;
                    }
                }
            }

            setFormData({
                name: decoded.name || "",
                email: decoded.email || "",
                dob: dobFormatted,
                gender: decoded.gender || "",
                element: decoded.menh || "",
            });
        } catch (err) {
            console.error("Invalid token", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        if (!userId) return;
        const cookies = parseCookies();

        const body = {
            name: formData.name,
            gender: formData.gender,
            dob: formData.dob,
            menh: formData.element
        };

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}api/auth/update/${userId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookies.access_token}`,
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await res.json();

            setCookie(null, "access_token", data.token, {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            });

            alert(data.message);
        } catch (err) {
            console.error(err);
            alert("Cập nhật thất bại");
        }
    };

    const handleLogout = () => {
        destroyCookie(null, "access_token", { path: "/" });
        router.push("/");
    };

    if (loading) return <p className="p-4">Đang tải...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm">Tên</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email || ""}
                        disabled
                        className="border p-2 w-full rounded bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm">Ngày sinh</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob || ""}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm">Giới tính</label>
                    <select
                        name="gender"
                        value={formData.gender || ""}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                    >
                        <option value="">Chưa chọn</option>
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm mb-1">Mệnh</label>
                    <div className="flex flex-wrap gap-4">
                        {["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"].map((m) => (
                            <label key={m} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="element"
                                    value={m}
                                    checked={formData.element === m}
                                    onChange={handleChange}
                                />
                                {m}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleUpdate}
                        className="bg-[#5e0000] hover:bg-[#a00000] text-white px-4 py-2 rounded"
                    >
                        Cập nhật
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    );
}
