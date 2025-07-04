'use client';

import styles from '../styles/Hero.module.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import the desk scene to avoid SSR issues
const DeskScene = dynamic(() => import('./DeskScene'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
      <img
        src="/profile-avatar.jpg"
        alt="Ton Nguyen profile"
        style={{ maxWidth: '60%', maxHeight: '60%', borderRadius: '50%', boxShadow: '0 4px 32px rgba(0,0,0,0.15)' }}
      />
    </div>
  )
});

export default function Hero() {
  const [isCanvasHovered, setIsCanvasHovered] = useState(false);
  return (
    <section className={styles.hero} id="home" aria-label="Introduction">
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              <span className={styles.name}>Ton Nguyen</span>
            </h1>
            <p className={styles.heroDescription}>
              Team Leader with extensive experience in e-commerce platforms, mobile development, and modern web technologies.
            </p>
            <div className={styles.heroButtons} role="navigation" aria-label="Main navigation">
              <a href="#about" className={styles.btnPrimary} aria-label="Learn more about Ton Nguyen">Learn More</a>
              <a href="#experience" className={styles.btnSecondary} aria-label="View Ton Nguyen's work experience">View Experience</a>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div
              className={styles.sceneContainer}
              onMouseEnter={() => setIsCanvasHovered(true)}
              onMouseLeave={() => setIsCanvasHovered(false)}
            >
              <DeskScene isHovered={isCanvasHovered} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollArrow}></div>
      </div>
    </section>
  );
} 