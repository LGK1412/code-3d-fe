"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from 'cookies-next';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const loadGoogle = () => {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = () => {
                /* global google */
                google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GG_ID,
                    callback: handleCredentialResponse,
                });

                google.accounts.id.renderButton(
                    document.getElementById("googleBtn"),
                    { theme: "outline", size: "large" }
                );
            };
            document.body.appendChild(script);
        };

        loadGoogle();
    }, []);

    async function handleCredentialResponse(response) {
        const base64Url = response.credential.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        const payload = JSON.stringify(JSON.parse(jsonPayload))

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload,
            });

            const data = await res.json();

            if (res.ok) {
                alert("Đăng nhập thành công!");
                setCookie("access_token", data.token);
                router.push("/");
            } else {
                alert(`Lỗi đăng nhập: ${data.message || "Thông tin không đúng"}`);
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Không thể kết nối đến server");
        }
    }

    return <div id="googleBtn"></div>;
}
