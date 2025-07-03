import styles from '../styles/Hero.module.css';

export default function LoadingSpinner() {
  return (
    <div className={styles.loadingPlaceholder}>
      <div className={styles.spinner}>
        <div className={styles.spinnerInner}></div>
      </div>
      <p>Loading 3D Character...</p>
    </div>
  );
} 