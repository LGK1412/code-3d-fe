"use client";

import { BoxHelper } from 'three'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function BoundingBox({ object }) {
    const helperRef = useRef()

    useEffect(() => {
        if (object && helperRef.current) {
            helperRef.current.update()
        }
    }, [object])

    useFrame(() => {
        if (object && helperRef.current) {
            helperRef.current.update()
        }
    })

    return object ? (
        <primitive
            ref={helperRef}
            object={new BoxHelper(object, 0xffff00)}
        />
    ) : null
}
