'use client';

import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

const AnimatedCharacter = forwardRef(function AnimatedCharacter({ 
  modelPath = '/models/Beach Character.glb',
  position = [0, 0, 0],
  scale = 1,
  autoPlay = true,
  animationSpeed = 1,
  loop = true,
  onAnimationsLoaded,
  onLoad,
  activity
}, ref) {
  const groupRef = ref || useRef();
  const mixerRef = useRef();
  const actionsRef = useRef({});
  const currentActionRef = useRef();
  const [animations, setAnimations] = useState([]);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isWalking, setIsWalking] = useState(false);

  // Load the GLB model
  const gltf = useLoader(GLTFLoader, modelPath);

  useEffect(() => {
    if (gltf && gltf.animations && gltf.animations.length > 0) {
      // Create animation mixer
      mixerRef.current = new THREE.AnimationMixer(gltf.scene);
      
      // Store all available animations
      const availableAnimations = gltf.animations.map((clip, index) => ({
        name: clip.name || `Animation_${index}`,
        clip: clip,
        index: index
      }));
      
      setAnimations(availableAnimations);
      
      // Create actions for all animations
      availableAnimations.forEach(({ name, clip }) => {
        const action = mixerRef.current.clipAction(clip);
        actionsRef.current[name] = action;
        // Set up animation properties
        action.setLoop(THREE.LoopOnce, 1); // Default to play once for all
        action.clampWhenFinished = true;
        action.timeScale = animationSpeed;
      });

      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  }, [gltf, animationSpeed]);

  // --- Idle/Walk Animation Logic ---
  const allowedIdleNames = [
    'CharacterArmature|Idle_Neutral',
    'CharacterArmature|Idle',
    'CharacterArmature|Idle_Gun',
    'CharacterArmature|Interact'
  ];
  const idleAnimations = animations.filter(a => allowedIdleNames.includes(a.name));
  const walkAnim = animations.find(a => a.name === 'CharacterArmature|Walk');
  const waveAnim = animations.find(a => a.name === 'CharacterArmature|Wave');

  // Helper to play a random idle
  const playRandomIdle = () => {
    if (idleAnimations.length > 0) {
      const idx = Math.floor(Math.random() * idleAnimations.length);
      playAnimation(idleAnimations[idx].name);
    }
  };

  // State to track idle loop
  const [idleLoopActive, setIdleLoopActive] = useState(false);
  const idleLoopRef = useRef(false);
  idleLoopRef.current = idleLoopActive;
  const idleLoopTimeoutRef = useRef();

  // On load: play wave, then immediately idle_neutral, then wait 2s, then start idle loop
  useEffect(() => {
    if (animations.length === 0) return;
    if (waveAnim) {
      setIsWaving(true);
      const waveAction = actionsRef.current[waveAnim.name];
      waveAction.setLoop(THREE.LoopOnce, 1);
      waveAction.clampWhenFinished = true;
      playAnimation(waveAnim.name);
      setIdleLoopActive(false);
      waveAction.getMixer().addEventListener('finished', function onWaveFinished(e) {
        if (e.action === waveAction) {
          setIsWaving(false);
          // Immediately switch to idle_neutral
          const idleNeutral = animations.find(a => a.name === 'CharacterArmature|Idle_Neutral');
          if (idleNeutral) playAnimation(idleNeutral.name);
          // Wait 2s, then start idle loop
          idleLoopTimeoutRef.current = setTimeout(() => {
            setIdleLoopActive(true);
          }, 2000);
          waveAction.getMixer().removeEventListener('finished', onWaveFinished);
        }
      });
    } else {
      setIsWaving(false);
      setIdleLoopActive(true);
    }
    return () => { clearTimeout(idleLoopTimeoutRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animations.length]);

  // Idle loop: when active, play random idle, and on finish, wait 2s, then play another
  useEffect(() => {
    if (isWaving || isWalking || !idleLoopActive) return;
    let stop = false;
    const playNext = () => {
      if (isWaving || isWalking || !idleLoopRef.current || stop) return;
      playRandomIdle();
      // Listen for finish
      const current = currentActionRef.current;
      if (current) {
        const onFinish = (e) => {
          if (e.action === current) {
            current.getMixer().removeEventListener('finished', onFinish);
            idleLoopTimeoutRef.current = setTimeout(() => {
              playNext();
            }, 2000);
          }
        };
        current.getMixer().addEventListener('finished', onFinish);
      }
    };
    playNext();
    return () => { stop = true; clearTimeout(idleLoopTimeoutRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idleLoopActive, idleAnimations.length, isWaving, isWalking]);

  // React to activity prop
  useEffect(() => {
    if (!animations.length || isWaving) return;
    if (typeof activity === 'string') {
      if (activity === 'walk' && walkAnim) {
        setIdleLoopActive(false);
        setIsWalking(true);
        clearTimeout(idleLoopTimeoutRef.current);
        playAnimation(walkAnim.name);
      } else if (activity === 'idle') {
        // Immediately stop walking and start idle loop
        clearTimeout(idleLoopTimeoutRef.current);
        setIsWalking(false);
        setIdleLoopActive(true);
      }
    }
    return () => { clearTimeout(idleLoopTimeoutRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity, animations.length, isWaving]);

  // Animation loop
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  // Function to play a specific animation (Three.js pattern)
  const playAnimation = (animationName, fadeInTime = 0.5) => {
    const actions = actionsRef.current;
    const nextAction = actions[animationName];
    if (!nextAction) {
      return;
    }
    // Ensure walk animation always loops forever
    if (animationName === 'CharacterArmature|Walk') {
      nextAction.setLoop(THREE.LoopRepeat, Infinity);
      nextAction.clampWhenFinished = false;
    }
    // Fade out the current action
    if (currentActionRef.current && currentActionRef.current !== nextAction) {
      currentActionRef.current.fadeOut(fadeInTime);
    }
    // Fade in and play the new action
    nextAction.reset().fadeIn(fadeInTime).play();
    currentActionRef.current = nextAction;
    setCurrentAnimation(animationName);
  };

  // Function to blend between animations
  const blendAnimations = (animation1, animation2, weight = 0.5, fadeTime = 0.3) => {
    if (!actionsRef.current[animation1] || !actionsRef.current[animation2]) {
      return;
    }

    const action1 = actionsRef.current[animation1];
    const action2 = actionsRef.current[animation2];

    // Reset and play both animations
    action1.reset().fadeIn(fadeTime).play();
    action2.reset().fadeIn(fadeTime).play();

    // Set blend weights
    action1.setEffectiveWeight(1 - weight);
    action2.setEffectiveWeight(weight);
  };

  // Function to stop all animations
  const stopAnimations = (fadeOutTime = 0.5) => {
    Object.values(actionsRef.current).forEach(action => {
      action.fadeOut(fadeOutTime);
    });
    setCurrentAnimation(null);
  };

  // Function to set animation speed
  const setAnimationSpeed = (speed) => {
    Object.values(actionsRef.current).forEach(action => {
      action.timeScale = speed;
    });
  };

  // Attach animation controls to the ref when animations are set
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.playAnimation = playAnimation;
      groupRef.current.blendAnimations = (animation1, animation2, weight = 0.5, fadeTime = 0.3) => {
        if (!actionsRef.current[animation1] || !actionsRef.current[animation2]) {
          return;
        }
        const action1 = actionsRef.current[animation1];
        const action2 = actionsRef.current[animation2];
        action1.reset().fadeIn(fadeTime).play();
        action2.reset().fadeIn(fadeTime).play();
        action1.setEffectiveWeight(1 - weight);
        action2.setEffectiveWeight(weight);
      };
      groupRef.current.stopAnimations = (fadeOutTime = 0.5) => {
        Object.values(actionsRef.current).forEach(action => {
          action.fadeOut(fadeOutTime);
        });
        setCurrentAnimation(null);
      };
      groupRef.current.setAnimationSpeed = (speed) => {
        Object.values(actionsRef.current).forEach(action => {
          action.timeScale = speed;
        });
      };
      groupRef.current.animations = animations;
      groupRef.current.currentAnimation = currentAnimation;
      if (animations.length > 0) {
        if (typeof onAnimationsLoaded === 'function') {
          onAnimationsLoaded(animations);
        }
      }
    }
  }, [animations, currentAnimation, onAnimationsLoaded]);

  if (!gltf) {
    return null;
  }

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={gltf.scene} />
      {process.env.NODE_ENV === 'development' && (
        <mesh>
          <boxGeometry args={[1, 2, 1]} />
          <meshBasicMaterial color="red" wireframe opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  );
});

export default AnimatedCharacter;

// Hook for easy animation control
export function useAnimationControls(characterRef) {
  const playAnimation = (name, fadeTime = 0.5) => {
    if (characterRef.current?.playAnimation) {
      characterRef.current.playAnimation(name, fadeTime);
    }
  };

  const blendAnimations = (anim1, anim2, weight = 0.5, fadeTime = 0.3) => {
    if (characterRef.current?.blendAnimations) {
      characterRef.current.blendAnimations(anim1, anim2, weight, fadeTime);
    }
  };

  const stopAnimations = (fadeTime = 0.5) => {
    if (characterRef.current?.stopAnimations) {
      characterRef.current.stopAnimations(fadeTime);
    }
  };

  const setSpeed = (speed) => {
    if (characterRef.current?.setAnimationSpeed) {
      characterRef.current.setAnimationSpeed(speed);
    }
  };

  const getAnimations = () => {
    return characterRef.current?.animations || [];
  };

  const getCurrentAnimation = () => {
    return characterRef.current?.currentAnimation || null;
  };

  return {
    playAnimation,
    blendAnimations,
    stopAnimations,
    setSpeed,
    getAnimations,
    getCurrentAnimation
  };
} 