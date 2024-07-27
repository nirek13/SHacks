import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import '../Meditation.css';

const BreathingExercise = ({ inhaleDuration, exhaleDuration, holdDuration }) => {
    const [phase, setPhase] = useState('inhale'); // inhale, exhale, hold
    const [timer, setTimer] = useState(inhaleDuration);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev > 0) return prev - 1;

                switch (phase) {
                    case 'inhale':
                        setPhase('hold');
                        return holdDuration;
                    case 'hold':
                        setPhase('exhale');
                        return exhaleDuration;
                    case 'exhale':
                        setPhase('inhale');
                        return inhaleDuration;
                    default:
                        return inhaleDuration;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [phase, inhaleDuration, exhaleDuration, holdDuration]);

    return (
        <div className="breathing-exercise">
            <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Sphere args={[1, 32, 32]}>
                    <meshStandardMaterial color="#76c7c0" />
                    <Html center>
                        <div className="instructions">
                            {phase === 'inhale' && <p>Inhale</p>}
                            {phase === 'hold' && <p>Hold</p>}
                            {phase === 'exhale' && <p>Exhale</p>}
                        </div>
                    </Html>
                </Sphere>
            </Canvas>
        </div>
    );
};

export default BreathingExercise;
