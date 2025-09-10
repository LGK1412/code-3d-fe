'use client'

import { Canvas } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { state } from '@/utils/state';
import { useSnapshot } from 'valtio';
import _3DMainScreen from '@/components/3d/_3DMainScreen';
import Sidebar from '@/components/3d/Sidebar3d';
import BottomToolbar from '@/components/3d/BottomToolbar';
import PhongThuyPopup from '@/components/3d/PhongThuyPopup';
import NavBar from '@/components/NavBar';
import { parseCookies, setCookie } from 'nookies';
import { jwtVerify } from 'jose';

export default function _3DCoreScreen() {
  const [models, setModels] = useState([]);
  const snap = useSnapshot(state);
  const [popupInfo, setPopupInfo] = useState(null);
  const [roomType, setRoomType] = useState('default');
  const [roomGLB, setRoomGLB] = useState(null);
  const [showMenhModal, setShowMenhModal] = useState(false);
  const [selectedMenh, setSelectedMenh] = useState('');
  const [userId, setUserId] = useState(null);

  const addModel = (model_name, name, menh, huong_bad, huong_good) => {
    const newId = Date.now().toString();
    setModels((oldModels) => [...oldModels, { model_name, name, id: newId, menh, huong_bad, huong_good }]);
  };

  // Check menh khi load
  useEffect(() => {
    const checkMenh = async () => {
      const cookies = parseCookies();
      const token = cookies.access_token;
      if (!token) return;

      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
        );

        setUserId(payload.userId);

        if (!payload.menh) {
          setShowMenhModal(true);
        }
      } catch (err) {
        console.error('Token verify failed:', err);
      }
    };

    checkMenh();
  }, []);

  // Gửi update mệnh
  const handleUpdateMenh = async () => {
    if (!selectedMenh || !userId) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/update/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menh: selectedMenh }),
      });

      const data = await res.json();
      if (data.success && data.token) {
        setCookie(null, 'access_token', data.token, {
          maxAge: 60 * 60 * 24 * 180,
          path: '/',
        });
        setShowMenhModal(false);
      }
    } catch (err) {
      console.error('Update menh error:', err);
    }
  };

  return (
    <div className="bg-[url('/background/BG1.png')] min-h-screen">
      <NavBar />
      <div className="flex relative h-screen">
        <Canvas
          shadows
          camera={{ position: [-12, 12, 0] }}
          onPointerMissed={(e) => {
            if (e.button === 0) {
              state.current = null;
              setPopupInfo(null);
            }
          }}
        >
          <_3DMainScreen
            models={models}
            setModels={setModels}
            setPopupInfo={setPopupInfo}
            roomType={roomType}
            roomGLB={roomGLB}
          />
        </Canvas>

        <Sidebar addModel={addModel} />
        <BottomToolbar setModels={setModels} setRoomType={setRoomType} setRoomGLB={setRoomGLB} />
        {popupInfo && (
          <PhongThuyPopup
            menh={popupInfo.menh}
            huong_good={popupInfo.huong_good}
            huong_bad={popupInfo.huong_bad}
            name={popupInfo.name}
          />
        )}


        {/* Modal nhập mệnh */}
        {showMenhModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-semibold mb-4">Nhập mệnh của bạn</h2>
              <select
                value={selectedMenh}
                onChange={(e) => setSelectedMenh(e.target.value)}
                className="border p-2 w-full rounded"
              >
                <option value="">-- Chọn mệnh --</option>
                <option value="Kim">Kim</option>
                <option value="Mộc">Mộc</option>
                <option value="Thủy">Thủy</option>
                <option value="Hỏa">Hỏa</option>
                <option value="Thổ">Thổ</option>
              </select>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowMenhModal(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Bỏ qua
                </button>
                <button
                  onClick={handleUpdateMenh}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
