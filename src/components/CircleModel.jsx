// components/CircleModel.jsx
"use client";
import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function CircleModelMesh({ modelPath }) {
  // Xóa cache để buộc reload model mới
  useEffect(() => {
    useGLTF.clear(modelPath);
  }, [modelPath]);

  const { scene } = useGLTF(modelPath);
  return (
    <primitive
      object={scene}
      position={[0, -0.7, 0]}
      scale={[1.6, 1.6, 1.6]}
      rotation={[0, Math.PI, 0]} // Xoay 180 độ ngang (quay mặt lại)
    />
  );
}

export default function CircleModel({ modelPath }) {
  return (
    <div className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68vw] h-[68vw] max-w-[968px] max-h-[968px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} />
        <Suspense fallback={null}>
          {/* key giúp re-render khi modelPath thay đổi */}
          <CircleModelMesh key={modelPath} modelPath={modelPath} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
