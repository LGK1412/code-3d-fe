"use client";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false)
    const router = useRouter();
    // password phải >=6 ký tự
    const isPasswordValid = newPassword.length >= 6;

    const canVerify =
        email &&
        otp &&
        newPassword &&
        confirmPassword &&
        newPassword === confirmPassword &&
        isPasswordValid;

    const handleSendOtp = async () => {
        if (!email) {
            toast.error("Nhập email trước!");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}api/auth/send-forgot-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await res.json();
            if (data.success) {
                toast.success("Đã gửi mã OTP, kiểm tra email!");
                setOtpSent(true);
            } else {
                toast.error(data.message || "Gửi OTP thất bại!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi kết nối server!");
        }
        setLoading(false);
    };

    const handleVerify = async () => {
        if (!canVerify) {
            if (!isPasswordValid) {
                toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
            }
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}api/auth/verify-forgot-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email,
                        providedCode: otp,
                        newPassword,
                    }),
                }
            );

            const data = await res.json();
            if (data.success) {
                setDone(true)
                toast.success("Mật khẩu đã được thay đổi thành công!", { duration: 2000 });
                setTimeout(() => {
                    router.push("/login"); // ví dụ redirect trang login
                }, 2500);
            } else {
                toast.error(data.message || "Xác minh thất bại!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi kết nối server!");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow space-y-4">
            <Toaster position="top-right" reverseOrder={false} />
            <h2 className="text-xl font-bold">Quên mật khẩu</h2>

            {/* Email + gửi OTP */}
            <div>
                <label className="block mb-1">Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    disabled={otpSent}
                />
                <button
                    onClick={handleSendOtp}
                    disabled={otpSent || loading}
                    className="mt-2 w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Đang gửi..." : "Gửi OTP"}
                </button>
            </div>

            {/* Nhập OTP */}
            {otpSent && (
                <div>
                    <label className="block mb-1">Mã OTP:</label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
            )}

            {/* Mật khẩu mới */}
            {otpSent && (
                <>
                    <div>
                        <label className="block mb-1">Mật khẩu mới:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Nhập lại mật khẩu:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </>
            )}

            {/* Xác minh */}
            {otpSent && (
                <button
                    onClick={handleVerify}
                    disabled={!canVerify || loading || done}
                    className="w-full bg-green-500 text-white py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Đang xác minh..." : "Xác minh"}
                </button>
            )}
        </div>
    );
}
