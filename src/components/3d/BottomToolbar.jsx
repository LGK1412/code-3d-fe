"use client";

import { useEffect, useRef, useState } from "react";
import { FaTrashAlt, FaQuestionCircle } from "react-icons/fa";
import { state } from '@/utils/state';
import { useSnapshot } from 'valtio';
import RoomSwitcherPopup from "./RoomSwitcherPopup";

export default function BottomToolbar({ setRoomType, setRoomGLB, setModels }) { // mấy cái props bỏ dc
    const snap = useSnapshot(state);
    const [showTutorial, setShowTutorial] = useState(false);
    const tutorialRef = useRef();

    const toggleDeleteMode = () => {
        state.deleteMode = !snap.deleteMode;
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (tutorialRef.current && !tutorialRef.current.contains(e.target)) {
                setShowTutorial(false);
            }
        };

        if (showTutorial) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showTutorial]);

    return (
        <>
            {/* Toolbar */}
            <div className="absolute bottom-[10%] left-[40%] -translate-x-1/2 bg-[#515151] rounded-[25px] p-2 shadow-md flex items-center gap-3 z-20 h-[50px] w-fit max-w-[40%] min-w-[50px]">
                {/* Nút delete */}
                <button
                    onClick={toggleDeleteMode}
                    className={`w-[30px] h-full flex items-center justify-center text-[10px] cursor-pointer border-none bg-[#515151] ${snap.deleteMode ? 'text-red-500' : 'text-emerald-500'}`}
                >
                    <FaTrashAlt className="w-[35px] h-[35px] p-1.5" />
                </button>

                {/* Nút tutorial */}
                <button
                    onClick={() => setShowTutorial(true)}
                    className="w-[35px] h-full flex items-center justify-center text-[10px] cursor-pointer text-blue-500 border-none bg-[#515151]"
                >
                    <FaQuestionCircle className="w-[35px] h-[35px] p-1.5" />
                </button>
                <RoomSwitcherPopup
                    setRoomType={setRoomType}
                    setRoomGLB={setRoomGLB}
                    setModels={setModels}
                />
            </div>

            {/* Tutorial popup */}
            {showTutorial && (
                <div
                    ref={tutorialRef}
                    className="absolute bottom-[20%] left-1/2 -translate-x-1/2 bg-white text-black rounded-xl p-5 max-w-[400px] shadow-2xl z-30 text-left font-sans leading-relaxed"
                >
                    {/* Nút đóng */}
                    <button
                        onClick={() => setShowTutorial(false)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
                    >
                        &times;
                    </button>
                    <h3 className="mt-0 mb-2 text-lg font-semibold">Hướng dẫn sử dụng</h3>
                    <ul className="list-disc pl-5 m-0 text-sm space-y-1">
                        <li>
                            Click biểu tượng <FaTrashAlt className="inline-block align-middle" /> để bật/tắt chế độ xoá.
                        </li>
                        <li>Thêm model bằng dấu cộng trong danh sách.</li>
                        <li>Chọn model cần di chuyển và dùng chuột để di chuyển.</li>
                        <li>Nhấp chuột phải vào model đã chọn để xoay.</li>
                        <li>Giữ chuột ngoài phòng để xoay phòng.</li>
                        <li>Giữ nút control + chuột ngoài phòng để di chuyển phòng.</li>
                        <li>Click ngoài vùng này để tắt hướng dẫn.</li>
                    </ul>
                </div>
            )}
        </>
    );
} 