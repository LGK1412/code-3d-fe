"use client";

import { useRef, useState, useEffect } from 'react'
import { FaHouse } from "react-icons/fa6";

const rooms = [
    {
        id: 'R1_v6.glb',
        model_name: 'R1_v6.glb',
        name: 'Phòng 1',
        image: '/roomImage/1.png',
    },
    {
        id: 'default',
        model_name: '',
        name: 'Phòng mặc định',
        image: '/roomImage/1.png',
    }
]

export default function RoomSwitcherPopup({ setRoomType, setRoomGLB, setModels }) {
    const [showPopup, setShowPopup] = useState(false)
    const popupRef = useRef(null)

    // Tắt popup khi click ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelectRoom = (room) => {
        setModels([])
        if (room.id === 'default') {
            setRoomType('default')
            setRoomGLB(null)
        } else {
            setRoomType('glb')
            setRoomGLB(room.model_name)
        }
        setShowPopup(false)
    }

    return (
        <div className="relative z-30">
            {/* Nút mở popup */}
            <button
                onClick={() => setShowPopup(true)}
                className="w-[35px] h-full flex items-center justify-center text-[10px] cursor-pointer text-white border-none bg-[#515151]"
            >
                <FaHouse className="w-[35px] h-[35px] p-1.5" />
            </button>

            {showPopup && (
                <div
                    ref={popupRef}
                    className="absolute bottom-16 right-0 bg-white rounded-xl p-4 shadow-2xl text-black w-64"
                >
                    <h3 className="text-md font-semibold mb-2">Chọn loại phòng</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                className="cursor-pointer hover:opacity-80"
                                onClick={() => handleSelectRoom(room)}
                            >
                                <img
                                    src={room.image}
                                    alt={room.name}
                                    className="rounded-md w-full h-20 object-cover"
                                />
                                <p className="text-sm text-center mt-1">{room.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
