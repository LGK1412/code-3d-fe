import { useRef, useEffect } from 'react';
import { SoftShadows, useHelper, OrbitControls, TransformControls } from '@react-three/drei';
import { DirectionalLightHelper } from 'three';
import Room from './room';
import ModelLoader from './ModelLoader';
import { useSnapshot } from 'valtio';
import { state, modes } from '@/utils/state';
import { useThree } from '@react-three/fiber';
import { Box3, Vector3 } from 'three';
import GLBModel from './GLBModel';
import CompassOverlay from './CompassOverlay';

export default function _3DMainScreen({ models, setModels, setPopupInfo, roomType, roomGLB }) {
    const directionalLightRef = useRef();
    const transform = useRef();
    const modelRefs = useRef({});
    const snap = useSnapshot(state);
    const { gl } = useThree();

    useEffect(() => {
        const control = transform.current;
        if (!control) return;

        const clampPosition = () => {
            const obj = control.object;
            if (!obj) return;

            const box = new Box3().setFromObject(obj);
            const size = new Vector3();
            box.getSize(size);

            const padding = 0.1;
            const min = {
                x: -4 + size.x / 2 + padding,
                y: size.y / 2 + padding,
                z: -7.5 + size.z / 2 + padding,
            };
            const max = {
                x: 4 - size.x / 2 - padding,
                y: 8 - size.y / 2 + padding,
                z: 7.5 - size.z / 2 - padding,
            };

            obj.position.x = Math.max(min.x, Math.min(max.x, obj.position.x));
            obj.position.y = Math.max(min.y, Math.min(max.y, obj.position.y));
            obj.position.z = Math.max(min.z, Math.min(max.z, obj.position.z));
        };

        control.addEventListener('objectChange', clampPosition);
        return () => control.removeEventListener('objectChange', clampPosition);
    }, [snap.current]);

    useEffect(() => {
        const onPointerMissed = (e) => {
            if (e.button === 0) {
                state.current = null;
            }
        };
        gl.domElement.addEventListener('pointermissed', onPointerMissed);
        return () => gl.domElement.removeEventListener('pointermissed', onPointerMissed);
    }, [gl.domElement]);

    return (
        <>
            <directionalLight
                ref={directionalLightRef}
                position={[-4, 10, 8]}
                intensity={2.5}
                color="#ffeb87"
                castShadow
            />
            <ambientLight intensity={0.4} />

            {roomType === 'default' && <Room size={[1, 1, 1]} color="#ffffff" />}

            {roomType === 'glb' && roomGLB && (
                <GLBModel name={roomGLB} model_name={roomGLB} id="room" onSelect={() => { }} />
            )}

            {models.map(({ model_name, name, id, menh, huong_bad, huong_good }) => (
                <ModelLoader
                    key={id}
                    id={id}
                    model_name={model_name}
                    name={name}
                    position={[0, 0, 0]}
                    ref={(el) => {
                        if (el) modelRefs.current[id] = el;
                        else delete modelRefs.current[id];
                    }}
                    onSelect={() => {
                        if (state.deleteMode) {
                            setModels((prev) => prev.filter((m) => m.id !== id));
                            if (state.current === id) state.current = null;
                            setPopupInfo(null);
                        } else {
                            state.current = id;
                            setPopupInfo({ menh, huong_bad, huong_good, name });
                        }
                    }}
                />
            ))}

            {snap.current && modelRefs.current[snap.current] && (
                <>
                    <TransformControls
                        ref={transform}
                        object={modelRefs.current[snap.current]}
                        mode={modes[snap.mode]}
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                    />
                </>
            )}
            <OrbitControls makeDefault minDistance={2} maxDistance={20} />
            <CompassOverlay />
        </>
    );
}