import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Rotating Sphere Component
// Rotating Sphere Component
const RotatingSphere = ({ prompt, mousePosition, setSphereScale, setSphereColor }) => {
    const sphereRef = useRef();
    const [scale, setScale] = useState(1);
    const [color, setColor] = useState('#87CEFA'); // Initial color

    useFrame(({ clock }) => {
        if (sphereRef.current) {
            // Adjust sphere rotation based on mouse position
            sphereRef.current.rotation.y = mousePosition.x * 0.05;
            sphereRef.current.rotation.x = mousePosition.y * 0.05;

            // Animate sphere scale for a peaceful effect
            const time = clock.getElapsedTime();
            const oscillation = Math.sin(time * 2) * 0.1 + 1;
            const newScale = scale * oscillation;
            sphereRef.current.scale.set(newScale, newScale, newScale);

            // Update scale and color states
            setSphereScale(newScale);
            setSphereColor(color);
        }
    });

    useEffect(() => {
        // Update sphere properties based on the current prompt
        switch (prompt) {
            case 'Inhale deeply':
                setScale(1);
                setColor('#87CEFA'); // Light Blue
                break;
            case 'Hold your breath for a moment':
                setScale(1);
                setColor('#00BFFF'); // Deep Sky Blue
                break;
            case 'Exhale slowly':
                setScale(1);
                setColor('#FFD700'); // Gold
                break;
            case 'Feel the calmness wash over you':
                setScale(1.2);
                setColor('#90EE90'); // Light Green
                break;
            case 'Stare deep into the expanding and contracting circles':
                setScale(1.3);
                setColor('#FF69B4'); // Hot Pink
                break;
            case 'Let your mind drift with the movement of the particles':
                setScale(1.4);
                setColor('#FFA07A'); // Light Salmon
                break;
            case 'As you breathe in, feel the particles come closer':
                setScale(1.5);
                setColor('#20B2AA'); // Light Sea Green
                break;
            case 'As you breathe out, let the particles float further apart':
                setScale(1.6);
                setColor('#9370DB'); // Medium Purple
                break;
            case 'Embrace the serenity of the moment':
                setScale(1.7);
                setColor('#4682B4'); // Steel Blue
                break;
            case 'Focus on the gentle rise and fall of your breath':
                setScale(1.8);
                setColor('#B0E0E6'); // Powder Blue
                break;
            case 'Imagine the particles dancing in harmony with your breathing':
                setScale(1.9);
                setColor('#FFC0CB'); // Pink
                break;
            case 'With each inhale, draw in positive energy':
                setScale(2.0);
                setColor('#7FFFD4'); // Aquamarine
                break;
            case 'With each exhale, release all tension and negativity':
                setScale(2.1);
                setColor('#FF4500'); // Orange Red
                break;
            case 'Visualize yourself surrounded by a tranquil, blue light':
                setScale(2.2);
                setColor('#1E90FF'); // Dodger Blue
                break;
            case 'Feel the light expanding and contracting with each breath':
                setScale(2.3);
                setColor('#32CD32'); // Lime Green
                break;
            case 'Allow your mind to wander to a peaceful place':
                setScale(2.4);
                setColor('#FFDAB9'); // Peach Puff
                break;
            case 'Notice how the particles respond to your calmness':
                setScale(2.5);
                setColor('#8A2BE2'); // Blue Violet
                break;
            case 'Let go of all thoughts and just be in the moment':
                setScale(2.6);
                setColor('#00CED1'); // Dark Turquoise
                break;
            case 'Feel a sense of unity with the particles around you':
                setScale(2.7);
                setColor('#FF6347'); // Tomato
                break;
            case 'Embrace the peacefulness of this experience':
                setScale(2.8);
                setColor('#2E8B57'); // Sea Green
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
const FloatingParticles = ({ sphereScale, sphereColor }) => {
    const particleCount = 1000;
    const baseDistance = 1.5; // Base distance for particles from the center

    // Precompute the spherical coordinates for particle positions
    const particles = useMemo(() => {
        const baseDistance = 1.5; // Base distance for particles
        const generateSphericalCoordinates = (distance) => {
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = distance * Math.sin(phi) * Math.cos(theta);
            const y = distance * Math.sin(phi) * Math.sin(theta);
            const z = distance * Math.cos(phi);
            return [x, y, z];
        };

        const initialDistance = baseDistance; // Initial distance
        return Array.from({ length: particleCount }).map(() => ({
            position: generateSphericalCoordinates(initialDistance),
            color: sphereColor,
        }));
    }, [sphereColor]); // Only depend on color for initial generation

    // Calculate the distance of particles from the center based on sphere scale
    const distance = sphereScale * baseDistance;

    return (
        <>
            {particles.map((particle, index) => (
                <mesh key={index} position={particle.position.map(coord => coord * distance)}>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshBasicMaterial color={sphereColor} />
                </mesh>
            ))}
        </>
    );
};

// Text Overlay Component
// Text Overlay Component
const TextOverlay = ({ prompt }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timeout = setTimeout(() => {
            setVisible(false);
        }, 3000); // Fade out after 3 seconds
        return () => clearTimeout(timeout);
    }, [prompt]);

    const fontSize = '2em';
    const color = '#000000'; // Black

    return (
        <div style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize,
            color,
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            transition: 'opacity 1s ease-in-out',
            opacity: visible ? 1 : 0,
        }}>
            {prompt}
        </div>
    );
};

// Main Scene Component
const MeditationScene = () => {
    const [prompt, setPrompt] = useState('inhale');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [sphereScale, setSphereScale] = useState(1);
    const [sphereColor, setSphereColor] = useState('#87CEFA'); // Initial color

    useEffect(() => {
        // Cycle through prompts every 4 seconds
        const prompts = [
            'Inhale deeply',
            'Hold your breath for a moment',
            'Exhale slowly',
            'Feel the calmness wash over you',
            'Stare deep into the expanding and contracting circles',
            'Let your mind drift with the movement of the particles',
            'As you breathe in, feel the particles come closer',
            'As you breathe out, let the particles float further apart',
            'Embrace the serenity of the moment',
            'Focus on the gentle rise and fall of your breath',
            'Imagine the particles dancing in harmony with your breathing',
            'With each inhale, draw in positive energy',
            'With each exhale, release all tension and negativity',
            'Visualize yourself surrounded by a tranquil, blue light',
            'Feel the light expanding and contracting with each breath',
            'Allow your mind to wander to a peaceful place',
            'Notice how the particles respond to your calmness',
            'Let go of all thoughts and just be in the moment',
            'Feel a sense of unity with the particles around you',
            'Embrace the peacefulness of this experience'
        ];
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
        <div style={{ position: 'relative', height: '100vh', width: '100vw', background: '#ffffff' }}>
            <Canvas
                style={{ height: '100%', width: '100%' }}
                camera={{ position: [0, 0, 5] }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <RotatingSphere
                    prompt={prompt}
                    mousePosition={mousePosition}
                    setSphereScale={setSphereScale}
                    setSphereColor={setSphereColor}
                />
                <FloatingParticles
                    sphereScale={sphereScale}
                    sphereColor={sphereColor}
                />
            </Canvas>
            <TextOverlay prompt={prompt} />
        </div>
    );
};

export default MeditationScene;
