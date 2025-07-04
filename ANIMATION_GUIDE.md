# 3D Model Animation Guide

This guide explains how to implement animations for 3D models in your React Three Fiber project, based on the [Three.js animation example](https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_blending.html).

## Overview

The animation system consists of several key components:

1. **GLTFLoader** - Loads animated GLB/GLTF models
2. **AnimationMixer** - Manages animation playback
3. **AnimationAction** - Controls individual animations
4. **Animation blending** - Smooth transitions between animations

## Key Concepts

### 1. Animation Mixer
The `AnimationMixer` is the core component that manages all animations for a model. It updates the animation state on each frame.

```javascript
const mixer = new THREE.AnimationMixer(model);
```

### 2. Animation Actions
Each animation clip becomes an `AnimationAction` that can be controlled independently:

```javascript
const action = mixer.clipAction(animationClip);
action.setLoop(THREE.LoopRepeat, Infinity);
action.play();
```

### 3. Animation Blending
You can blend between multiple animations for smooth transitions:

```javascript
action1.setEffectiveWeight(0.7);
action2.setEffectiveWeight(0.3);
```

## Implementation

### Basic Setup

```javascript
import { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

function AnimatedModel({ modelPath }) {
  const mixerRef = useRef();
  const actionsRef = useRef({});
  
  // Load the model
  const gltf = useLoader(GLTFLoader, modelPath);
  
  useEffect(() => {
    if (gltf.animations && gltf.animations.length > 0) {
      // Create mixer
      mixerRef.current = new THREE.AnimationMixer(gltf.scene);
      
      // Create actions for all animations
      gltf.animations.forEach((clip) => {
        const action = mixerRef.current.clipAction(clip);
        actionsRef.current[clip.name] = action;
        action.setLoop(THREE.LoopRepeat, Infinity);
      });
      
      // Play first animation
      const firstAction = Object.values(actionsRef.current)[0];
      firstAction.play();
    }
  }, [gltf]);
  
  // Update mixer on each frame
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });
  
  return <primitive object={gltf.scene} />;
}
```

### Advanced Animation Control

```javascript
// Play specific animation
const playAnimation = (name, fadeTime = 0.5) => {
  // Stop all current animations
  Object.values(actionsRef.current).forEach(action => {
    action.fadeOut(fadeTime);
  });
  
  // Play selected animation
  const action = actionsRef.current[name];
  action.reset().fadeIn(fadeTime).play();
};

// Blend animations
const blendAnimations = (anim1, anim2, weight = 0.5) => {
  const action1 = actionsRef.current[anim1];
  const action2 = actionsRef.current[anim2];
  
  action1.reset().fadeIn(0.3).play();
  action2.reset().fadeIn(0.3).play();
  
  action1.setEffectiveWeight(1 - weight);
  action2.setEffectiveWeight(weight);
};

// Control animation speed
const setSpeed = (speed) => {
  Object.values(actionsRef.current).forEach(action => {
    action.timeScale = speed;
  });
};
```

## Usage Examples

### 1. Simple Character Animation

```javascript
import AnimatedCharacter from './components/AnimatedCharacter';

function MyScene() {
  return (
    <Canvas>
      <AnimatedCharacter 
        modelPath="/models/character.glb"
        position={[0, 0, 0]}
        autoPlay={true}
        animationSpeed={1}
      />
    </Canvas>
  );
}
```

### 2. Interactive Animation Controls

```javascript
import { useRef } from 'react';
import AnimatedCharacter, { useAnimationControls } from './components/AnimatedCharacter';

function InteractiveCharacter() {
  const characterRef = useRef();
  const { playAnimation, stopAnimations, setSpeed } = useAnimationControls(characterRef);
  
  return (
    <div>
      <AnimatedCharacter ref={characterRef} modelPath="/models/character.glb" />
      
      <button onClick={() => playAnimation('idle')}>Idle</button>
      <button onClick={() => playAnimation('walk')}>Walk</button>
      <button onClick={() => playAnimation('run')}>Run</button>
      <button onClick={() => stopAnimations()}>Stop</button>
      <button onClick={() => setSpeed(2)}>2x Speed</button>
    </div>
  );
}
```

### 3. Animation Blending

```javascript
function BlendedAnimations() {
  const characterRef = useRef();
  const { blendAnimations } = useAnimationControls(characterRef);
  
  const handleBlend = () => {
    // Blend 70% walk + 30% idle
    blendAnimations('walk', 'idle', 0.7);
  };
  
  return (
    <div>
      <AnimatedCharacter ref={characterRef} modelPath="/models/character.glb" />
      <button onClick={handleBlend}>Blend Walk + Idle</button>
    </div>
  );
}
```

## Best Practices

### 1. Performance Optimization

```javascript
// Dispose of mixer when component unmounts
useEffect(() => {
  return () => {
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current.uncacheRoot(gltf.scene);
    }
  };
}, [gltf]);
```

### 2. Error Handling

```javascript
useEffect(() => {
  if (gltf.animations && gltf.animations.length > 0) {
    try {
      mixerRef.current = new THREE.AnimationMixer(gltf.scene);
      // ... setup animations
    } catch (error) {
      console.error('Failed to setup animations:', error);
    }
  } else {
    console.warn('No animations found in model');
  }
}, [gltf]);
```

### 3. Loading States

```javascript
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  if (gltf.animations && gltf.animations.length > 0) {
    // ... setup animations
    setIsLoaded(true);
  }
}, [gltf]);

if (!isLoaded) {
  return <LoadingSpinner />;
}
```

## Common Animation Properties

### Loop Types
```javascript
action.setLoop(THREE.LoopRepeat, Infinity);  // Repeat forever
action.setLoop(THREE.LoopOnce, 1);           // Play once
action.setLoop(THREE.LoopPingPong, 2);       // Ping-pong twice
```

### Clamping
```javascript
action.clampWhenFinished = true;  // Stay on last frame
```

### Time Scale
```javascript
action.timeScale = 2.0;  // 2x speed
action.timeScale = 0.5;  // 0.5x speed
```

## Troubleshooting

### Animation Not Playing
1. Check if the model has animations: `console.log(gltf.animations)`
2. Verify the mixer is being updated: `useFrame((state, delta) => mixer.update(delta))`
3. Ensure the action is playing: `action.play()`

### Performance Issues
1. Limit the number of active animations
2. Use `action.stop()` instead of `action.fadeOut()` for immediate stops
3. Dispose of unused mixers and actions

### Blending Not Working
1. Ensure both animations are playing: `action1.play(); action2.play()`
2. Set proper weights: `action1.setEffectiveWeight(0.5)`
3. Check animation compatibility (same skeleton)

## Demo

Visit `/animation-demo` to see the animation system in action with the Beach Character model.

## Resources

- [Three.js Animation Documentation](https://threejs.org/docs/#api/en/animation/AnimationMixer)
- [GLTF Animation Guide](https://github.com/KhronosGroup/glTF-Tutorials/blob/master/gltfTutorial/gltfTutorial_006_Animations.md)
- [React Three Fiber Animation Examples](https://docs.pmnd.rs/react-three-fiber/getting-started/examples) 