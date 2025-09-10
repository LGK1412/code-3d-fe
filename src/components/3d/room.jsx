"use client";

import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect } from 'react'

// function WallWithHole({ color = '#ccc' }) {
//     const wallShape = new THREE.Shape()
//     wallShape.moveTo(-2.5, 0)
//     wallShape.lineTo(2.5, 0)
//     wallShape.lineTo(2.5, 5.1)
//     wallShape.lineTo(-2.6, 5.1)
//     wallShape.lineTo(-2.6, 0)

//     const hole = new THREE.Path()
//     hole.moveTo(-0.4, 0)
//     hole.lineTo(0.4, 0)
//     hole.lineTo(0.4, 1.7)
//     hole.lineTo(-0.4, 1.7)
//     hole.lineTo(-0.4, 0)
//     wallShape.holes.push(hole)

//     const extrudeSettings = { depth: 0.2, bevelEnabled: false }

//     const geometry = new THREE.ExtrudeGeometry(wallShape, extrudeSettings)

//     return (
//         <mesh geometry={geometry} position={[0, 0, -2.5]} castShadow receiveShadow>
//             <meshStandardMaterial color={color} />
//         </mesh>
//     )
// }


function Room({ size, color }) {
    const { scene } = useGLTF('/3dObj/wooden_door_3.glb')

    // useEffect(() => {
    //     scene.traverse((child) => {
    //         if (child.isMesh) {
    //             child.castShadow = true
    //             child.receiveShadow = true
    //             child.material.side = THREE.DoubleSide // phòng khi lỗi render mặt
    //         }
    //     })
    // }, [scene])

    return (
        <>
            {/* Trái */}
            <mesh position={[0, 4, -7.5]} scale={[8.2, 8.2, 0.2]} receiveShadow>
                <boxGeometry args={size} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* <group position={[0, 0, 0]}>
                <WallWithHole color={color} />
            </group> */}

            {/* Phải */}
            <mesh position={[4, 4, 0]} scale={[15, 8.2, 0.2]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                <boxGeometry args={size} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Sàn */}
            <mesh position={[0, 0, 0]} scale={[8.2, 15, 0.2]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
                <boxGeometry args={size} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* <primitive
                object={scene}
                position={[0, 0, -2.4]} // 🧱 sát tường sau
                rotation={[0, 1.55, 0]}    // chỉnh xoay nếu cần
                scale={[1, 1, 1]} // scale nếu to quá
            /> */}
        </>
    )
}

export default Room