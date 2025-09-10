'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavBar from '../../../components/NavBar';
import FooterSection from '../../../components/FooterSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import OtherProductOnly from '../../../components/OtherProductOnly';
import Image from 'next/image';
import { jwtVerify } from 'jose';
import { parseCookies } from 'nookies';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [otherProducts, setOtherProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [policyText, setPolicyText] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/product/${id}`);
                const data = await res.json();
                setProduct(data.data);
            } catch (err) {
                console.error('Lỗi lấy product:', err);
            } finally {
                setLoading(false);
            }
        };

        const fetchOthers = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/product/`);
                const data = await res.json();
                const others = data.data.filter((p) => p._id !== id);
                setOtherProducts(others);
            } catch (err) {
                console.error('Lỗi lấy danh sách khác:', err);
            }
        };

        const fetchPolicy = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/policy/`);
                const data = await res.json();
                setPolicyText(data?.data?.[0]?.content || 'Không có policy');
            } catch (err) {
                console.error('Lỗi lấy policy:', err);
                setPolicyText('Không thể tải policy');
            }
        };

        fetchPolicy();
        fetchProduct();
        fetchOthers();
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    const image = `${process.env.NEXT_PUBLIC_API_URL}productImg/${selectedImage || product.image_url?.[0]}`;
    const price = product.price?.toFixed(2) || '0.00';

    const handleAddToCart = async (productId) => {
        try {
            const { access_token } = parseCookies();

            if (!access_token) {
                toast.error('Chưa đăng nhập!');
                return;
            }

            const result = await Swal.fire({
                title: 'Bạn có muốn thêm sản phẩm này vào giỏ hàng?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Thêm',
                cancelButtonText: 'Huỷ',
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6'
            });

            if (!result.isConfirmed) return;

            // Giải mã JWT để lấy userId
            const { payload } = await jwtVerify(access_token, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET));
            const userId = payload.userId;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/cart/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId })
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Thêm giỏ hàng thành công!');
            } else {
                toast.error(data.message || 'Lỗi khi thêm giỏ hàng!');
            }

        } catch (err) {
            console.error(err);
            toast.error('Token lỗi hoặc hết hạn!');
        }
    };

    return (
        <div
            className="relative bg-cover bg-center min-h-screen"
            style={{ backgroundImage: `url('/background/BG5.png')` }}
        >
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>

            <div className="relative z-10">
                <NavBar />

                <div className="max-w-7xl mx-auto p-8">
                    {/* Breadcrumb */}
                    <div className="text-sm text-gray-500 mb-4">
                        Homepage &gt; Shop &gt; <span className="text-black">{product.name}</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10">
                        {/* Left Image Gallery */}
                        <div className="md:w-1/2">
                            <div className="w-[500px] h-[500px] relative">
                                <Image
                                    src={image}
                                    alt={product.name}
                                    fill
                                    className="object-cover object-bottom rounded shadow"
                                    unoptimized
                                />
                            </div>
                            {product.image_url && (
                                <div className="flex gap-3 mt-4">
                                    {product.image_url.map((img, i) => (
                                        <div key={i} className="w-20 h-20 relative cursor-pointer" onClick={() => setSelectedImage(img)}>
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_API_URL}productImg/${img}`}
                                                alt={`thumb-${i}`}
                                                fill
                                                className="object-cover rounded border"
                                                unoptimized
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Product Info */}
                        <div className="md:w-1/2">
                            <h1 className="text-3xl font-serif mb-2">{product.name}</h1>
                            <p className="text-sm text-gray-500 mb-4">(23 Reviews)</p>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-yellow-400 text-xl">★★★★★</div>
                                <div className="text-3xl font-bold text-red-700">${price}</div>
                                <div className="line-through text-gray-400">$170.00</div>
                            </div>

                            <p className="text-sm text-gray-500 italic mb-4">
                                Starting at $50.00/mo with LOREM
                            </p>

                            {/* <div className="bg-gray-100 p-4 rounded mb-6">
                                <h3 className="font-semibold mb-2">Product Material</h3>
                                <div className="relative w-full h-40">
                                    <Image
                                        src="/background/product-size.png"
                                        alt="material"
                                        fill
                                        className="rounded object-contain"
                                    />
                                </div>
                            </div> */}

                            {product.description && product.description.length > 0 && (
                                <div className="mt-6 border-t pt-4">
                                    <h4 className="font-semibold mb-2">SPEC & DESCRIPTION</h4>
                                    {product.description.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm border-b py-2">
                                            <span>{item.name}</span>
                                            <span>{item.infor}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-6 pt-4">
                                <h4 className="font-semibold mb-2">Policy</h4>
                                <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: policyText }} />
                            </div>

                            <button
                                onClick={() => handleAddToCart(product._id)}
                                className="mt-6 flex items-center gap-2 border text-black px-6 py-2 rounded-full hover:border-red-950 hover:bg-red-950 hover:text-white transition-all duration-200"
                            >
                                <FontAwesomeIcon icon={faCartPlus} />
                                Add to Cart
                            </button>

                        </div>
                    </div>
                </div>

                {/* Other Products */}
                <div className="mt-12">
                    <OtherProductOnly data={otherProducts} />
                </div>

                <FooterSection bgName="BG1" />
            </div>
        </div>
    );
}
