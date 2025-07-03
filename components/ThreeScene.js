'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import LoadingSpinner from './LoadingSpinner';

function ThreeScene({ children }) {
  const [key, setKey] = useState(0);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const handleContextLost = (event) => {
      console.log('WebGL context lost, recreating scene...');
      event.preventDefault();
      setContextLost(true);
      
      // Recreate the scene after a short delay
      setTimeout(() => {
        setKey(prev => prev + 1);
        setContextLost(false);
      }, 100);
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost, false);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
      }
    };
  }, []);

  if (contextLost) {
    return <LoadingSpinner />;
  }

  return (
    <Canvas
      key={key}
      camera={{ position: [1.6, 1.3, 2.1], fov: 60 }}
      style={{ background: 'transparent' }} // Ensures canvas is transparent
      gl={{ 
        antialias: true,
        alpha: true, // Ensures transparency
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: false
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0); // Alpha 0 for full transparency
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <Suspense fallback={null}>
        {/* Office lighting setup */}
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight 
          position={[-5, 3, -5]} 
          intensity={0.3} 
          color="#ffffff"
        />
        <pointLight 
          position={[0, 4, 2]} 
          intensity={0.5} 
          color="#ffffff" 
          distance={10} 
        />
        
        {children}
        
        {/* Office environment */}
        <Environment preset="apartment" />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
          maxDistance={8}
          minDistance={1.1}
          target={[0, 0.9, 0.4]}
        />
      </Suspense>
    </Canvas>
  );
}

export default ThreeScene; 