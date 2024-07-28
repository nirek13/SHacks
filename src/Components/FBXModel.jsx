import React, { useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three-stdlib';
import * as THREE from 'three';

const FBXModel = ({ modelPath, texturePath }) => {
    const fbx = useLoader(FBXLoader, modelPath);
    const texture = useLoader(THREE.TextureLoader, texturePath);
    const modelRef = useRef();

    useEffect(() => {
        if (modelRef.current) {
            modelRef.current.traverse((child) => {
                if (child.isMesh) {
                    child.material.map = texture;
                }
            });

            // Adjust the position and scale of the model if necessary
            modelRef.current.position.set(0, 0, 0);
            modelRef.current.scale.set(0.01, 0.01, 0.01); // Adjust scale to fit your scene
        }
    }, [fbx, texture]);

    return <primitive object={fbx} ref={modelRef} />;
};

export default FBXModel;
