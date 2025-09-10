import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";

export default function CompassOverlay() {
    const { camera } = useThree();
    const [rotation, setRotation] = useState(0);

    useFrame(() => {
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);

        // Góc theo mặt phẳng XZ
        let angle = Math.atan2(dir.x, dir.z) * (180 / Math.PI);
        setRotation(angle);
    });

    return (
        <Html fullscreen style={{ pointerEvents: "none" }}>
            <div style={{
                position: "absolute",
                top: 20,
                left: 20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: "2px solid white",
                background: "rgba(0,0,0,0.4)",
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 12,
                position: "relative"
            }}>
                {/* Vòng tròn xoay */}
                <div style={{
                    width: "100%",
                    height: "100%",
                    transform: `rotate(${rotation}deg)`,
                    position: "absolute",
                    top: 0,
                    left: 0
                }}>
                    <div style={{ position: "absolute", top: 0, left: "45%" }}>N</div>
                    <div style={{ position: "absolute", bottom: 0, left: "45%" }}>S</div>
                    <div style={{ position: "absolute", top: "45%", left: 0 }}>W</div>
                    <div style={{ position: "absolute", top: "45%", right: 0 }}>E</div>
                </div>

                {/* Mũi tên cố định */}
                <div style={{
                    position: "absolute",
                    top: "-10px",
                    left: "50%",
                    transform: "translateX(-50%) rotate(180deg)",
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderBottom: "12px solid red"
                }} />
            </div>
        </Html>
    );
}
