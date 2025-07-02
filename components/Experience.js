import styles from '../styles/Experience.module.css';

const experiences = [
  {
    title: 'Team Leader',
    company: 'Litium',
    period: 'Dec 2016 - Present',
    description:
      'Lead and mentor a cross-functional development team at Litium, a leading cloud platform for e-commerce, PIM, and digital marketing. Based in Stockholm, Sweden.',
    responsibilities: [
      'Drive the delivery of scalable, high-quality e-commerce platform for B2B and B2C customers',
      'Collaborate closely with Product Managers, UX, and other teams across locations',
      'Coach, mentor, and support the professional growth of team members',
      'Oversee project planning, resource allocation, and cross-team coordination',
    ],
    tech: ['Litium', '.NET', 'SQL Server', 'React', 'NextJS', 'Angular', 'Elastic Search'],
  },
  {
    title: 'Team Leader',
    company: 'EPiServer',
    period: 'Feb 2012 - Mar 2016',
    description:
      'Led the Commerce development team for EPiServer Commerce platform.',
    responsibilities: [
      'Managed the Hanoi Commerce team and coordinated with Stockholm headquarters',
      'Contributed to technology and solution decisions',
      'Oversaw resource management and project planning',
    ],
    tech: ['EPiServer CMS', 'EPiServer Commerce', 'SQL Server', 'jQuery', 'LESS', 'Dojo'],
  },
  {
    title: 'Software Engineer',
    company: 'EPiServer',
    period: 'Jun 2009 - Feb 2012',
    description:
      'Developed and maintained the EPiServer CMS platform, collaborating with international teams to deliver new features and improvements.',
    responsibilities: [
      'Maintained EPiServer CMS 6.x and contributed to CMS 7 development',
      'Worked closely with Stockholm-based developers',
      'Enhanced developer and editor experiences',
    ],
    tech: ['EPiServer CMS', 'SQL Server', 'jQuery', 'Dojo'],
  },
  {
    title: 'Indie Mobile Developer',
    company: 'Self-Employed',
    period: 'May 2010 - Sep 2015',
    description:
      'Designed and developed cross-platform mobile applications for Android, iOS, and BlackBerry, published on multiple app stores.',
    responsibilities: [
      'Published and maintained apps across Android, iOS, and BlackBerry platforms',
      'Implemented both native and web-based solutions',
      'Managed the full app lifecycle from concept to deployment',
    ],
    tech: ['Java', 'Xamarin', 'Cordova', 'BlackBerry SDK'],
  },
];

export default function Experience() {
  return (
    <section className={styles.experience} id="experience">
      <div className="container">
        <h2 className={styles.sectionTitle}>Work Experience</h2>
        <div className={styles.timeline}>
          {experiences.map((exp, idx) => (
            <div className={styles.timelineItem} key={exp.title + exp.period}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <h3>{exp.title}</h3>
                  <span className={styles.company}>{exp.company}</span>
                  <span className={styles.period}>{exp.period}</span>
                </div>
                <p className={styles.timelineDescription}>{exp.description}</p>
                <div className={styles.timelineDetails}>
                  <h4>Main Responsibilities:</h4>
                  <ul>
                    {exp.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  <div className={styles.techStack}>
                    {exp.tech.map((t) => (
                      <span className={styles.techTag} key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 