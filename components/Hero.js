import styles from '../styles/Hero.module.css';
import Image from 'next/image';

export default function Hero() {
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
            <div className={styles.profileContainer}>
              <Image 
                src="/Ton.webp" 
                alt="Ton Nguyen - Team Leader and Developer" 
                width={200} 
                height={200} 
                className={styles.profileImage}
                priority
              />
              <div className={styles.profileBorder}></div>
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