// MeditationScene.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Rotating Sphere Component
const RotatingSphere = ({ prompt, mousePosition }) => {
    const sphereRef = useRef();
    const [scale, setScale] = useState(1);
    const [color, setColor] = useState('#87CEFA');

    useFrame(() => {
        if (sphereRef.current) {
            // Adjust sphere rotation based on mouse position
            sphereRef.current.rotation.y = mousePosition.x * 0.05;
            sphereRef.current.rotation.x = mousePosition.y * 0.05;
        }
    });

    useEffect(() => {
        // Update sphere properties based on the current prompt
        switch (prompt) {
            case 'inhale':
                setScale(1.5);
                setColor('#87CEFA'); // Light Blue
                break;
            case 'exhale':
                setScale(1);
                setColor('#00BFFF'); // Deep Sky Blue
                break;
            case 'let go of stress':
                setScale(1.2);
                setColor('#FFD700'); // Gold
                break;
            case 'calm':
                setScale(1.3);
                setColor('#90EE90'); // Light Green
                break;
            default:
                setScale(1);
                setColor('#87CEFA'); // Default color
                break;
        }
    }, [prompt]);

    return (
        <Sphere ref={sphereRef} args={[1, 64, 64]} scale={[scale, scale, scale]}>
            <meshStandardMaterial color={color} />
        </Sphere>
    );
};

// Floating Particles Component
const FloatingParticles = ({ prompt }) => {
    const particleCount = 1000;
    const distance = prompt === 'inhale' ? 8 : prompt === 'exhale' ? 12 : prompt === 'calm' ? 10 : 10;
    const particles = Array.from({ length: particleCount }).map(() => ({
        position: [
            Math.random() * distance - distance / 2,
            Math.random() * distance - distance / 2,
            Math.random() * distance - distance / 2,
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

// Text Overlay Component
const TextOverlay = ({ prompt }) => {
    const fontSize = '2em';
    const color = '#FFFFFF'; // White

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize,
            color,
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
        }}>
            {prompt}
        </div>
    );
};

// Audio Component


// Main Scene Component
const MeditationScene = () => {
    const [prompt, setPrompt] = useState('inhale');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Cycle through prompts every 4 seconds
        const prompts = ['inhale', 'exhale', 'let go of stress', 'calm'];
        let index = 0;
        const interval = setInterval(() => {
            setPrompt(prompts[index]);
            index = (index + 1) % prompts.length;
        }, 4000); // Change prompt every 4 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100vw', background: '#B0E0E6' }}>
            <Canvas
                style={{ height: '100%', width: '100%' }}
                camera={{ position: [0, 0, 5] }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <RotatingSphere prompt={prompt} mousePosition={mousePosition} />
                <FloatingParticles prompt={prompt} />
            </Canvas>
            <TextOverlay prompt={prompt} />

        </div>
    );
};

export default MeditationScene;
