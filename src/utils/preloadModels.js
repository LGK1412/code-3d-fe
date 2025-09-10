import { useGLTF } from '@react-three/drei'

const PRELOAD_LIST = [
    'chair.glb',
    'bed.glb',
    'wardrobe.glb',
    'bed1.glb',
    'chair1.glb',
    'chair2.glb',
    'chair3.glb',
    'cuss1.glb',
    'cuss2.glb',
    'locker1.glb',
    'locker2.glb',
    'Plant1.glb',
    'plant2.glb',
    'plant3.glb',
    'plant4.glb',
    'rug1.glb',
    'rug2.glb',
    'sL1.glb',
    'SL2.glb',
    'table1.glb',
    'table2.glb',
    'Table3.glb',
    'table4.glb',
    'TBLight1.glb',
    'w1.glb',
    'w2.glb',
    'w3.glb',
]

export const PreloadAllModels = () => {
    PRELOAD_LIST.forEach(name => {
        useGLTF.preload(`/3dObj/${name}`)
    })
    return null
}
