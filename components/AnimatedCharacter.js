'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import ThreeScene from './ThreeScene';

function CartoonDeskScene() {
  const groupRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftHandRef = useRef();
  const rightHandRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Typing animation
    if (leftHandRef.current) {
      leftHandRef.current.position.y = 0.13 + Math.sin(t * 8) * 0.02;
    }
    if (rightHandRef.current) {
      rightHandRef.current.position.y = 0.13 + Math.sin(t * 8 + Math.PI) * 0.02;
    }
    // Subtle body movement
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 2) * 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Rug */}
      <mesh position={[0, -0.41, 0]}>
        <cylinderGeometry args={[1.6, 1.4, 0.02, 32]} />
        <meshStandardMaterial color="#ffe6b3" />
      </mesh>
      {/* Desk */}
      <mesh position={[0, 0, 0.5]}>
        <boxGeometry args={[1.8, 0.12, 0.6]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Desk legs */}
      {[[-0.8, -0.26, 0.2], [0.8, -0.26, 0.2], [-0.8, -0.26, 0.7], [0.8, -0.26, 0.7]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.05, 0.05, 0.28, 16]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
      ))}
      {/* Monitors */}
      <group position={[-0.35, 0.18, 0.85]}>
        <mesh>
          <boxGeometry args={[0.5, 0.32, 0.04]} />
          <meshStandardMaterial color="#23272e" />
        </mesh>
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 16]} />
          <meshStandardMaterial color="#b0b0b0" />
        </mesh>
      </group>
      <group position={[0.35, 0.18, 0.85]}>
        <mesh>
          <boxGeometry args={[0.5, 0.32, 0.04]} />
          <meshStandardMaterial color="#23272e" />
        </mesh>
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 16]} />
          <meshStandardMaterial color="#b0b0b0" />
        </mesh>
      </group>
      {/* Plant */}
      <group position={[0.85, -0.08, 0.3]}>
        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.16, 16]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color="#6fdc8c" />
        </mesh>
      </group>
      {/* Books and accessories */}
      <mesh position={[-0.7, 0.09, 0.2]}>
        <boxGeometry args={[0.12, 0.18, 0.08]} />
        <meshStandardMaterial color="#ffb347" />
      </mesh>
      <mesh position={[-0.55, 0.09, 0.2]}>
        <boxGeometry args={[0.09, 0.18, 0.08]} />
        <meshStandardMaterial color="#b3c6ff" />
      </mesh>
      {/* Penguin toy */}
      <group position={[-0.9, 0.09, 0.3]}>
        <mesh>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#23272e" />
        </mesh>
      </group>
      {/* Chair */}
      <group position={[0, -0.18, 0.1]}>
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[0.5, 0.08, 0.5]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh position={[0, 0.18, -0.22]}>
          <boxGeometry args={[0.5, 0.32, 0.08]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        {/* Chair legs */}
        {[[-0.18, -0.22, -0.18], [0.18, -0.22, -0.18], [-0.18, -0.22, 0.18], [0.18, -0.22, 0.18]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <cylinderGeometry args={[0.03, 0.03, 0.18, 16]} />
            <meshStandardMaterial color="#e0e0e0" />
          </mesh>
        ))}
      </group>
      {/* Character (facing away) */}
      <group position={[0, 0.13, 0.35]} rotation={[0, Math.PI, 0]}>
        {/* Body */}
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.11, 0.13, 0.28, 24]} />
          <meshStandardMaterial color="#3d3d3d" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.33, 0]}>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial color="#b97a56" />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.41, -0.03]}>
          <sphereGeometry args={[0.14, 24, 24, 0, Math.PI]} />
          <meshStandardMaterial color="#5a4637" />
        </mesh>
        {/* Left arm */}
        <group ref={leftArmRef} position={[-0.11, 0.19, 0]} rotation={[0, 0, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.035, 0.18, 16]} />
            <meshStandardMaterial color="#b97a56" />
          </mesh>
          <group ref={leftHandRef} position={[0, 0.13, 0]}>
            <mesh>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial color="#b97a56" />
            </mesh>
          </group>
        </group>
        {/* Right arm */}
        <group ref={rightArmRef} position={[0.11, 0.19, 0]} rotation={[0, 0, -0.2]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.035, 0.18, 16]} />
            <meshStandardMaterial color="#b97a56" />
          </mesh>
          <group ref={rightHandRef} position={[0, 0.13, 0]}>
            <mesh>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial color="#b97a56" />
            </mesh>
          </group>
        </group>
        {/* Left leg */}
        <mesh position={[-0.05, -0.13, 0.04]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.18, 16]} />
          <meshStandardMaterial color="#23272e" />
        </mesh>
        {/* Right leg */}
        <mesh position={[0.05, -0.13, 0.04]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.18, 16]} />
          <meshStandardMaterial color="#23272e" />
        </mesh>
      </group>
    </group>
  );
}

export default function AnimatedCharacter() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ThreeScene>
        <CartoonDeskScene />
      </ThreeScene>
    </div>
  );
} 