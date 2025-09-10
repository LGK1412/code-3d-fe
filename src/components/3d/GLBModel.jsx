"use client";

import { useGLTF } from '@react-three/drei'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { useCursor } from '@react-three/drei'
import { useSnapshot } from 'valtio'
import { state, modes } from '@/utils/state';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { Box3, Vector3 } from 'three'

const GLBModel = forwardRef(({ id, model_name, onSelect }, ref) => {

    const { scene } = useGLTF(`${process.env.NEXT_PUBLIC_API_URL}model/${model_name}`)
    const [hovered, setHovered] = useState(false)
    const snap = useSnapshot(state)
    useCursor(hovered)

    // ✅ Chỉ clone scene đúng 1 lần — tránh render lại không cần thiết
    const clonedScene = useMemo(() => {
        const cloned = clone(scene)
        cloned.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        // ✅ Tính bounding box và log kích thước
        const box = new Box3().setFromObject(cloned)
        const size = new Vector3()
        box.getSize(size)
        // console.log(`📦 Kích thước của ${name}:`, size)

        return cloned
    }, [scene])

    return (
        <primitive
            ref={ref}
            object={clonedScene}
            position={[0, 0.5, 0]}
            onClick={e => {
                e.stopPropagation()
                onSelect()
            }}
            onContextMenu={e => {
                e.stopPropagation()
                if (state.current === id) {
                    state.mode = (snap.mode + 1) % modes.length
                }
            }}
            onPointerOver={e => {
                e.stopPropagation()
                setHovered(true)
            }}
            onPointerOut={e => setHovered(false)}
        />
    )
})

export default GLBModel
