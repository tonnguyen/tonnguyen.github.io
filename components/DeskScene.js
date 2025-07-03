'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import ThreeScene from './ThreeScene';

function FallbackProfile() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
      <img
        src="/Ton.webp"
        alt="Ton Nguyen profile"
        style={{ maxWidth: '60%', maxHeight: '60%', borderRadius: '50%', boxShadow: '0 4px 32px rgba(0,0,0,0.15)' }}
      />
    </div>
  );
}

function DeskSceneContent() {
  const groupRef = useRef();

  // Always call hooks at the top level
  const deskGLTF = useGLTF('/models/Adjustable Desk.glb');
  const characterGLTF = useGLTF('/models/Beach Character.glb');
  const laptopGLTF = useGLTF('/models/Laptop.glb');

  // If any model is missing, show fallback
  if (!deskGLTF.scene || !characterGLTF.scene || !laptopGLTF.scene) {
    return <FallbackProfile />;
  }

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
      // Gentle floating for character
      if (groupRef.current.children[1]) {
        groupRef.current.children[1].position.y = Math.sin(t * 1.5) * 0.05;
      }
    }
  });

  // Compose the scene
  const desk = deskGLTF.scene.clone();
  desk.position.set(0, 0, 0.8);
  desk.scale.setScalar(1);
  desk.rotation.y = Math.PI / 2;

  const character = characterGLTF.scene.clone();
  character.position.set(0, 0, 0);
  character.scale.setScalar(1);

  const laptop = laptopGLTF.scene.clone();
  laptop.position.set(0, 0.943, 0.6);
  laptop.scale.setScalar(0.04);
  laptop.rotation.y = Math.PI;

  return (
    <group ref={groupRef}>
      {/* Desk */}
      <primitive object={desk} />
      {/* Character */}
      <primitive object={character} />
      {/* Laptop */}
      <primitive object={laptop} />
    </group>
  );
}

export default function DeskScene() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ThreeScene>
        <DeskSceneContent />
      </ThreeScene>
    </div>
  );
} 