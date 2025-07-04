'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import ThreeScene from './ThreeScene';
import { Box3 } from 'three';

function FallbackProfile() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
      <img
        src="/profile-avatar.jpg"
        alt="Ton Nguyen profile"
        style={{ maxWidth: '60%', maxHeight: '60%', borderRadius: '50%', boxShadow: '0 4px 32px rgba(0,0,0,0.15)' }}
      />
    </div>
  );
}

function DeskSceneContent({ isHovered }) {
  const groupRef = useRef();
  const characterRef = useRef();
  const mixerRef = useRef();
  const actionsRef = useRef({});
  const currentActionRef = useRef();
  const [animations, setAnimations] = useState([]);
  const [isWaving, setIsWaving] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [idleLoopActive, setIdleLoopActive] = useState(false);
  const idleLoopTimeoutRef = useRef();

  // Always call hooks at the top level
  const deskGLTF = useGLTF('/models/Adjustable Desk.glb');
  const characterGLTF = useGLTF('/models/Beach Character.glb');
  const laptopGLTF = useGLTF('/models/Laptop.glb');

  // Animation functions (define before useEffect)
  const playAnimation = (animationName, fadeInTime = 0.5) => {
    const actions = actionsRef.current;
    const nextAction = actions[animationName];
    if (!nextAction) {
      return;
    }
    
    // Stop all other actions
    Object.keys(actions).forEach(name => {
      if (actions[name] !== nextAction) {
        actions[name].stop();
      }
    });

    // Fade out the current action
    if (currentActionRef.current && currentActionRef.current !== nextAction) {
      currentActionRef.current.fadeOut(fadeInTime);
    }
    
    // Fade in and play the new action
    nextAction.reset().fadeIn(fadeInTime).play();
    currentActionRef.current = nextAction;
  };

  const playRandomIdle = () => {
    const allowedIdleNames = [
      'CharacterArmature|Idle_Neutral',
      'CharacterArmature|Idle',
      'CharacterArmature|Idle_Gun',
      'CharacterArmature|Interact'
    ];
    const idleAnimations = animations.filter(a => allowedIdleNames.includes(a.name));
    if (idleAnimations.length > 0) {
      const idx = Math.floor(Math.random() * idleAnimations.length);
      playAnimation(idleAnimations[idx].name);
    }
  };

  // If any model is missing, show fallback
  if (!deskGLTF.scene || !characterGLTF.scene || !laptopGLTF.scene) {
    return <FallbackProfile />;
  }

  // Set up character animations
  useEffect(() => {
    if (characterGLTF.animations && characterGLTF.animations.length > 0) {
      
      // Store all available animations
      const availableAnimations = characterGLTF.animations.map((clip, index) => ({
        name: clip.name || `Animation_${index}`,
        clip: clip,
        index: index
      }));
      
      setAnimations(availableAnimations);
    }
  }, [characterGLTF]);

  // Compose the scene
  const desk = deskGLTF.scene;
  desk.position.set(0, 0, 0.8);
  desk.scale.setScalar(1);
  desk.rotation.y = Math.PI / 2;

  const character = characterGLTF.scene;
  // Compute bounding box to place feet on ground
  typeof window !== 'undefined' && (() => {
    const bbox = new Box3().setFromObject(character);
    if (bbox && bbox.min && typeof bbox.min.y === 'number') {
      // Add manual offset if needed to ensure feet touch ground
      character.position.y = -bbox.min.y - 0.05; // Adjust -0.05 as needed
    }
  })();
  character.position.x = 0;
  character.position.z = 0;
  character.scale.setScalar(1);
  characterRef.current = character;

  const laptop = laptopGLTF.scene;
  laptop.position.set(0, 0.943, 0.6);
  laptop.scale.setScalar(0.04);
  laptop.rotation.y = Math.PI;

  // Set up animation mixer for the character
  useEffect(() => {
    if (characterRef.current && characterGLTF.animations && characterGLTF.animations.length > 0) {
      
      // Create animation mixer with the character
      mixerRef.current = new THREE.AnimationMixer(characterRef.current);
      
      // Create actions for all animations
      characterGLTF.animations.forEach((clip) => {
        const action = mixerRef.current.clipAction(clip);
        actionsRef.current[clip.name] = action;
        // Set up animation properties
        action.setLoop(THREE.LoopOnce, 1); // Default to play once for all
        action.clampWhenFinished = true;
        
        // Special handling for walk animation
        if (clip.name === 'CharacterArmature|Walk') {
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.clampWhenFinished = false;
        }
      });

      // Start with wave animation
      const waveAnim = characterGLTF.animations.find(a => a.name === 'CharacterArmature|Wave');
      
      if (waveAnim) {
        setIsWaving(true);
        const waveAction = actionsRef.current[waveAnim.name];
        waveAction.setLoop(THREE.LoopOnce, 1);
        waveAction.clampWhenFinished = true;
        playAnimation(waveAnim.name);
        
        waveAction.getMixer().addEventListener('finished', function onWaveFinished(e) {
          if (e.action === waveAction) {
            setIsWaving(false);
            // Immediately switch to idle_neutral
            const idleNeutral = characterGLTF.animations.find(a => a.name === 'CharacterArmature|Idle_Neutral');
            if (idleNeutral) {
              playAnimation(idleNeutral.name);
              // Wait for idle_neutral to finish, then start idle loop
              const idleNeutralAction = actionsRef.current[idleNeutral.name];
              idleNeutralAction.getMixer().addEventListener('finished', function onIdleNeutralFinished(e) {
                if (e.action === idleNeutralAction) {
                  idleNeutralAction.getMixer().removeEventListener('finished', onIdleNeutralFinished);
                  // Wait 2s, then start idle loop
                  idleLoopTimeoutRef.current = setTimeout(() => {
                    setIdleLoopActive(true);
                  }, 2000);
                }
              });
            } else {
              // If idle_neutral not found, wait 2s then start idle loop
              idleLoopTimeoutRef.current = setTimeout(() => {
                setIdleLoopActive(true);
              }, 2000);
            }
            waveAction.getMixer().removeEventListener('finished', onWaveFinished);
          }
        });
      } else {
        setIdleLoopActive(true);
      }
    }
  }, [characterGLTF]);

  // Idle loop effect
  useEffect(() => {
    if (isWaving || isWalking || !idleLoopActive) return;
    
    let stop = false;
    const playNext = () => {
      if (isWaving || isWalking || !idleLoopActive || stop) return;
      playRandomIdle();
      
      // Listen for finish
      const current = currentActionRef.current;
      if (current) {
        const onFinish = (e) => {
          if (e.action === current) {
            current.getMixer().removeEventListener('finished', onFinish);
            // Wait 2s before playing next random idle animation
            idleLoopTimeoutRef.current = setTimeout(() => {
              if (!stop && !isWaving && !isWalking && idleLoopActive) {
                playNext();
              }
            }, 2000);
          }
        };
        current.getMixer().addEventListener('finished', onFinish);
      }
    };
    
    playNext();
    return () => { stop = true; clearTimeout(idleLoopTimeoutRef.current); };
  }, [idleLoopActive, isWaving, isWalking, animations]);

  // Mouse interaction handlers
  const handlePointerEnter = () => {
    if (isWaving || isWalking) {
      return;
    }
    const walkAnim = animations.find(a => a.name === 'CharacterArmature|Walk');
    if (walkAnim) {
      setIdleLoopActive(false);
      setIsWalking(true);
      clearTimeout(idleLoopTimeoutRef.current);
      playAnimation(walkAnim.name);
    }
  };

  const handlePointerLeave = () => {
    if (isWaving) return;
    if (!isWalking) return;
    clearTimeout(idleLoopTimeoutRef.current);
    setIsWalking(false);
    // Stop the current walk animation and start idle loop immediately
    const current = currentActionRef.current;
    if (current && current.getClip().name === 'CharacterArmature|Walk') {
      current.stop();
      current.reset();
    }
    setIdleLoopActive(true);
  };

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }
    
    // Update animation mixer
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  useEffect(() => {
    if (!animations.length) return;
    if (isHovered) {
      // Start walk animation
      const walkAnim = animations.find(a => a.name === 'CharacterArmature|Walk');
      if (walkAnim) {
        setIdleLoopActive(false);
        setIsWalking(true);
        clearTimeout(idleLoopTimeoutRef.current);
        playAnimation(walkAnim.name);
      }
    } else {
      // Stop walk, resume idle
      if (isWalking) {
        clearTimeout(idleLoopTimeoutRef.current);
        setIsWalking(false);
        const current = currentActionRef.current;
        if (current && current.getClip().name === 'CharacterArmature|Walk') {
          current.stop();
          current.reset();
        }
        setIdleLoopActive(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, animations.length]);

  return (
    <group ref={groupRef}>
      {/* Desk */}
      <primitive object={desk} />
      {/* Character */}
      <primitive object={character} />
      {/* Laptop */}
      <primitive object={laptop} />
      {/* Transparent overlay removed; now controlled by isHovered prop */}
    </group>
  );
}

export default function DeskScene({ isHovered }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ThreeScene>
        <DeskSceneContent isHovered={isHovered} />
      </ThreeScene>
    </div>
  );
} 