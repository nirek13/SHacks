import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Rotating Sphere Component
const RotatingSphere = ({ prompt, mousePosition }) => {
    const sphereRef = useRef();
    const [scale, setScale] = useState(1);
    const [color, setColor] = useState('#87CEFA');

    useFrame(({ clock }) => {
        if (sphereRef.current) {
            // Adjust sphere rotation based on mouse position
            sphereRef.current.rotation.y = mousePosition.x * 0.05;
            sphereRef.current.rotation.x = mousePosition.y * 0.05;

            // Animate sphere scale for a peaceful effect
            const time = clock.getElapsedTime();
            const oscillation = Math.sin(time * 2) * 0.1 + 1;
            sphereRef.current.scale.set(scale * oscillation, scale * oscillation, scale * oscillation);
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
        <Sphere ref={sphereRef} args={[1, 64, 64]}>
            <meshStandardMaterial color={color} />
        </Sphere>
    );
};

// Floating Particles Component
const FloatingParticles = ({ prompt }) => {
    const particleCount = 1000;
    const baseDistance = 1.5; // Base distance for particles from the center
    const distance = prompt === 'inhale' ? baseDistance * 1.2 : prompt === 'exhale' ? baseDistance * 1.5 : baseDistance;

    // Function to generate random spherical coordinates
    const generateSphericalCoordinates = () => {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = distance * Math.sin(phi) * Math.cos(theta);
        const y = distance * Math.sin(phi) * Math.sin(theta);
        const z = distance * Math.cos(phi);
        return [x, y, z];
    };

    const particles = Array.from({ length: particleCount }).map(() => ({
        position: generateSphericalCoordinates(),
        color: '#FFFFFF', // White
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
