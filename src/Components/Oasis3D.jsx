import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';
import { FontLoader } from 'three-stdlib';
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'; // You can replace this with any font you like

const OasisText = () => {
    const font = new FontLoader().parse(helvetiker);
    const textRef = useRef();

    // Animation loop
    useFrame(() => {
        textRef.current.rotation.y += 0.01;
    });

    return (
        <Text3D ref={textRef} font={font} size={1} height={0.2} curveSegments={12}>
            Oasis
            <meshStandardMaterial color="orange" />
        </Text3D>
    );
};

const Oasis3D = () => {
    return (
        <Canvas
            style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '300px',
                height: '300px',
            }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 0, 5]} />
            <OasisText />
        </Canvas>
    );
};

export default Oasis3D;
