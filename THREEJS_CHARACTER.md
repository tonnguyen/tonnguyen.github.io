# Three.js Animated Character

This project now features an interactive 3D animated character created with Three.js that replaces the static profile photo in the Hero section.

## Features

- **Animated Character**: A 3D character sitting at a computer desk
- **Typing Animation**: Realistic hand movements simulating typing
- **Interactive**: Auto-rotating camera with smooth controls
- **Responsive**: Adapts to different screen sizes
- **Loading State**: Smooth loading experience with spinner

## Components

### AnimatedCharacter.js
The main Three.js component that renders:
- Character with head, torso, arms, and legs
- Office chair with realistic proportions
- Computer desk with monitor and keyboard
- Smooth animations for typing and breathing

### LoadingSpinner.js
A loading component that displays while the 3D scene loads.

## Animations

- **Head Movement**: Subtle nodding and looking at the screen
- **Hand Typing**: Alternating hand movements simulating keyboard typing
- **Body Breathing**: Gentle up and down movement
- **Chair Movement**: Slight rotation for realism
- **Screen Glow**: Dynamic screen brightness

## Technical Details

- Uses `@react-three/fiber` for React integration
- Uses `@react-three/drei` for additional utilities
- Dynamically imported to avoid SSR issues
- Responsive design with mobile optimization
- Glassmorphism styling with backdrop blur

## Dependencies

```json
{
  "three": "^0.162.0",
  "@react-three/fiber": "^9.2.0",
  "@react-three/drei": "^10.4.2"
}
```

## Usage

The character is automatically integrated into the Hero section and replaces the previous profile image. The component is loaded dynamically to ensure optimal performance and avoid server-side rendering issues. 