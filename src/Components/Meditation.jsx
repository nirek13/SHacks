// MeditationScene.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Rotating Sphere Component
const RotatingSphere = () => {
    const sphereRef = useRef();
    useFrame(() => {
        if (sphereRef.current) {
            sphereRef.current.rotation.y += 0.01;
        }
    });
    return (
        <Sphere ref={sphereRef} args={[1, 64, 64]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#87CEFA" />
        </Sphere>
    );
};

// Floating Particles Component
const FloatingParticles = () => {
    const particleCount = 1000;
    const particles = Array.from({ length: particleCount }).map(() => ({
        position: [
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
        ],
        color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    }));

    return (
        <>
            {particles.map((particle, index) => (
                <mesh key={index} position={particle.position}>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshBasicMaterial color={particle.color} />
                </mesh>
            ))}
        </>
    );
};

// Meditation Scene Component
const MeditationScene = () => {
    return (
        <Canvas
            style={{ height: '100vh', width: '100vw', background: '#B0E0E6' }}
            camera={{ position: [0, 0, 5] }}
        >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <RotatingSphere />
            <FloatingParticles />
        </Canvas>
    );
};

export default MeditationScene;
