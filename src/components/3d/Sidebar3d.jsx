"use client";

import { useState, useEffect, useRef } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { FaCartPlus, FaSearch, FaFilter } from "react-icons/fa";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { FaFire, FaTint, FaLeaf, FaGem, FaMountain } from "react-icons/fa";
import { parseCookies } from "nookies";
import { jwtVerify } from "jose";
import { useGLTF } from "@react-three/drei";

export default function Sidebar({ addModel }) {
    const [search, setSearch] = useState("");
    const [models, setModels] = useState([]);
    const [styles, setStyles] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [userMenh, setUserMenh] = useState(""); // lấy từ token
    const [selectedMenhPT, setSelectedMenhPT] = useState(""); // chọn mệnh filter FE
    const [selectedMenh, setSelectedMenh] = useState("");

    const filterRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilter(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const menhStyles = {
        "Hỏa": { color: "text-red-500", icon: <FaFire /> },
        "Thủy": { color: "text-blue-500", icon: <FaTint /> },
        "Mộc": { color: "text-green-500", icon: <FaLeaf /> },
        "Kim": { color: "text-gray-500", icon: <FaGem /> },
        "Thổ": { color: "text-orange-500", icon: <FaMountain /> },
    };

    const menhRelation = {
        "Kim": ["Thổ", "Kim"],
        "Mộc": ["Thủy", "Mộc"],
        "Thủy": ["Kim", "Thủy"],
        "Hỏa": ["Mộc", "Hỏa"],
        "Thổ": ["Hỏa", "Thổ"],
    };

    const preloadModels = (models) => {
        let i = 0;
        const loadNext = (deadline) => {
            while (deadline.timeRemaining() > 0 && i < models.length) {
                const url = `${process.env.NEXT_PUBLIC_API_URL}model/${models[i].model_name}`;
                useGLTF.preload(url);
                i++;
            }
            if (i < models.length) {
                requestIdleCallback(loadNext);
            }
        };
        requestIdleCallback(loadNext);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cookies = parseCookies();
                const token = cookies.access_token;

                let menhFromToken = "";
                if (token) {
                    const { payload } = await jwtVerify(
                        token,
                        new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
                    );
                    menhFromToken = payload.menh || "";
                    setUserMenh(menhFromToken);
                }

                // fetch product (KHÔNG sort theo mệnh ở BE nữa)
                const resProduct = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/product/notHide`);
                const productData = await resProduct.json();

                if (productData.success) {
                    setModels(
                        productData.data.map((p) => ({
                            id: p._id,
                            name: p.name,
                            model_name: p.model_name,
                            price: p.price,
                            styleId: p.style,
                            image: p.image_url?.[0]
                                ? `${process.env.NEXT_PUBLIC_API_URL}productImg/${p.image_url[0]}`
                                : "https://placehold.co/60x60",
                            menh: p.menh_main,
                            huong_good: p.huong_good,
                            huong_bad: p.huong_bad,
                            sellQuantity: p.sellQuantity || 0,
                        }))
                    );

                    preloadModels(productData.data);
                }

                // fetch style
                const resStyle = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/style/notHide`);
                const styleData = await resStyle.json();
                if (styleData.success) {
                    setStyles(styleData.data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    // --- SORT + FILTER BY MỆNH ---
    const applyMenhSort = (list) => {
        const menhToUse = selectedMenhPT || userMenh || "";
        if (!menhToUse) {
            return [...list].sort((a, b) => b.sellQuantity - a.sellQuantity);
        }

        const bestMenhList = menhRelation[menhToUse] || [];

        const bestProducts = list
            .filter((p) => bestMenhList.includes(p.menh))
            .sort((a, b) => b.sellQuantity - a.sellQuantity)
            .slice(0, 20);

        const remainingProducts = list
            .filter((p) => !bestProducts.includes(p))
            .sort((a, b) => b.sellQuantity - a.sellQuantity);

        return [...bestProducts, ...remainingProducts];
    };

    // filter search + style
    const filtered = applyMenhSort(
        models.filter((model) => {
            const matchSearch = model.name.toLowerCase().includes(search.toLowerCase());
            const matchStyle = selectedStyle ? model.styleId === selectedStyle : true;
            const matchMenh = selectedMenh ? model.menh === selectedMenh : true; // thêm filter menh
            return matchSearch && matchStyle && matchMenh;
        })
    );

    return (
        <div className="absolute top-0 right-0 h-full w-[400px] flex flex-col pt-8 font-inria">
            <h2 className="text-[70px] font-bold text-gray-900 uppercase text-center w-full h-[70px]">
                Product
            </h2>

            <div className="w-full rounded-[30px] backdrop-blur-2xl bg-white/10 flex flex-col p-5 shadow-2xl overflow-y-auto mt-auto custom-scroll h-[80vh]">
                {/* Search + Filter */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search model..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pr-20 pl-4 py-1.5 rounded-full border border-gray-300 bg-white text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <div
                        onClick={() => setShowFilter(!showFilter)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 text-gray-500 text-sm cursor-pointer"
                    >
                        <FaSearch />
                        <FaFilter />
                    </div>

                    {/* Filter popup */}
                    {showFilter && (
                        <div ref={filterRef} className="absolute top-full right-0 mt-2 w-56 bg-white p-3 rounded-lg shadow-lg z-50">
                            <div className="flex border-b mb-2">
                                <button
                                    onClick={() => setShowFilter("style")}
                                    className={`flex-1 py-1 ${showFilter === "style" ? "border-b-2 border-blue-500 font-bold" : ""}`}
                                >
                                    Style
                                </button>
                                <button
                                    onClick={() => setShowFilter("menhPT")}
                                    className={`flex-1 py-1 ${showFilter === "menhPT" ? "border-b-2 border-blue-500 font-bold" : ""}`}
                                >
                                    Mệnh PT
                                </button>
                                <button
                                    onClick={() => setShowFilter("menh")}
                                    className={`flex-1 py-1 ${showFilter === "menh" ? "border-b-2 border-blue-500 font-bold" : ""}`}
                                >
                                    Mệnh
                                </button>
                            </div>

                            {showFilter === "style" && (
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => setSelectedStyle(null)} className={`${!selectedStyle ? "bg-blue-500 text-white" : "bg-gray-100"} px-3 py-1 rounded`}>
                                        All
                                    </button>
                                    {styles.map((style) => (
                                        <button key={style._id} onClick={() => setSelectedStyle(style._id)} className={`${selectedStyle === style._id ? "bg-blue-500 text-white" : "bg-gray-100"} px-3 py-1 rounded`}>
                                            {style.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {showFilter === "menhPT" && (
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => setSelectedMenhPT("")} className={`${!selectedMenhPT ? "bg-blue-500 text-white" : "bg-gray-100"} px-3 py-1 rounded`}>
                                        Default ({userMenh || "None"})
                                    </button>
                                    {Object.keys(menhStyles).map((m) => (
                                        <button key={m} onClick={() => setSelectedMenhPT(m)} className={`${selectedMenhPT === m ? "bg-blue-500 text-white" : "bg-gray-100"} px-3 py-1 rounded`}>
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {showFilter === "menh" && (
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => setSelectedMenh("")} className={`${!selectedMenh ? "bg-blue-500 text-white" : "bg-gray-100"} px-3 py-1 rounded`}>
                                        Default
                                    </button>
                                    {Object.keys(menhStyles).map((m) => (
                                        <button key={m} onClick={() => setSelectedMenh(m)} className={`${selectedMenh === m ? "bg-blue-500 text-white" : "bg-gray-100"} px-3 py-1 rounded`}>
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* List product */}
                {filtered.map((model) => {
                    const style = menhStyles[model.menh] || {};
                    const colorClass = `${style.color}`;

                    return (
                        <div key={model.id} className="relative mb-3">
                            <button
                                onClick={() =>
                                    addModel(model.model_name, model.name, model.menh, model.huong_bad, model.huong_good)
                                }
                                className={`absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full border-none font-bold z-10 flex items-center justify-center p-0 ${colorClass}`}
                            >
                                <FaCirclePlus size={14} />
                            </button>

                            <div
                                className="w-full min-h-[90px] bg-white cursor-pointer font-semibold transition-opacity duration-200 rounded-lg flex items-center gap-3 p-2 relative border-l-4"
                            >
                                <img
                                    src={model.image}
                                    alt="model"
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="text-left flex-1 relative flex flex-col justify-center">
                                    <div className={`absolute top-0 right-0 w-5 h-5 ${colorClass}`}>
                                        {style.icon}
                                    </div>
                                    <p className="text-[25px] font-normal">{model.name}</p>
                                    <p className="text-[10px] italic font-light capitalize">{model.menh}</p>
                                    <p className="text-[25px] flex items-center">
                                        {model.price.toFixed(2)}$
                                        <span className="ml-4 w-10 h-5 rounded-full flex items-center justify-center">
                                            <FaCartPlus className="w-4 h-4 text-white" />
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent flex justify-center items-end pointer-events-none">
                <MdKeyboardDoubleArrowDown className="w-[50px] h-[50px] text-[#01070f]" />
            </div>
        </div>
    );
}
