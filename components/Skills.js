import styles from '../styles/Skills.module.css';

const skills = [
  {
    category: 'Programming Languages',
    items: [
      { name: 'C#', level: 'expert' },
      { name: 'Java', level: 'advanced' },
      { name: 'JavaScript', level: 'expert' },
    ],
  },
  {
    category: 'Web Technologies',
    items: [
      { name: '.NET', level: 'expert' },
      { name: 'React', level: 'expert' },
      { name: 'Angular', level: 'expert' },
    ],
  },
  {
    category: 'Mobile Development',
    items: [
      { name: 'React Native', level: 'advanced' },
      { name: 'Android', level: 'advanced' },
      { name: 'Expo', level: 'intermediate' },
    ],
  },
];

const levelLabels = {
  expert: 'Expert',
  advanced: 'Advanced',
  intermediate: 'Intermediate',
  beginner: 'Beginner',
};

export default function Skills() {
  return (
    <section className={styles.skills} id="skills">
      <div className="container">
        <h2 className={styles.sectionTitle}>Technical Skills</h2>
        <div className={styles.skillsGrid}>
          {skills.map((cat) => (
            <div className={styles.skillCategory} key={cat.category}>
              <h3>{cat.category}</h3>
              <div className={styles.skillItems}>
                {cat.items.map((item) => (
                  <div className={styles.skillItem} key={item.name}>
                    <span className={styles.skillName}>{item.name}</span>
                    <span className={`${styles.skillLevel} ${styles[item.level]}`}>{levelLabels[item.level]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 