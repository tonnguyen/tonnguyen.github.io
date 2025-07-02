import styles from '../styles/About.module.css';

const summaryPoints = [
  'Experienced Team Leader at Litium, based in Stockholm, Sweden',
  'Proven track record in leading high-performing development teams',
  'Strong technical background in .NET, React, Angular, and e-commerce platforms',
  'Excellent communication, mentoring, and cross-functional collaboration skills',
  'Dedicated to continuous learning and delivering high-quality solutions',
];

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className="container">
        <h2 className={styles.sectionTitle}>About Me</h2>
        <div className={styles.aboutContentColumn}>
          <div className={styles.aboutCard}>
            <h3>Professional Summary</h3>
            <ul className={styles.summaryList}>
              {summaryPoints.map((point, idx) => (
                <li key={idx}><span className={styles.checkmark}>✓</span> {point}</li>
              ))}
            </ul>
          </div>
          <div className={styles.aboutCard}>
            <h3>Education</h3>
            <div className={styles.educationItem}>
              <div className={styles.educationYear}>&nbsp;2009&nbsp;-&nbsp;2010&nbsp;</div>
              <div className={styles.educationDetails}>
                <h4>BSc in Computing</h4>
                <p>University of Greenwich</p>
              </div>
            </div>
            <div className={styles.educationItem}>
              <div className={styles.educationYear}>&nbsp;2004&nbsp;-&nbsp;2007&nbsp;</div>
              <div className={styles.educationDetails}>
                <h4>Higher Diploma in Software Engineering</h4>
                <p>FPT-Aptech Computer Education</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 