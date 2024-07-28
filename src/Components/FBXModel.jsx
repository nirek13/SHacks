import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const BreathingSphere = ({ phase, inhaleDuration, exhaleDuration }) => {
    const mesh = useRef();
    const maxScale = 1.5;
    const minScale = 1;

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();
        let scale;

        switch (phase) {
            case 'inhale':
                scale = minScale + (maxScale - minScale) * (Math.sin((elapsedTime / inhaleDuration) * Math.PI - Math.PI / 2) + 1) / 2;
                break;
            case 'exhale':
                scale = maxScale - (maxScale - minScale) * (Math.sin((elapsedTime / exhaleDuration) * Math.PI - Math.PI / 2) + 1) / 2;
                break;
            default:
                scale = minScale;
                break;
        }

        mesh.current.scale.set(scale, scale, scale);
    });

    return (
        <mesh ref={mesh}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#76c7c0" />
        </mesh>
    );
};

export default BreathingSphere;
