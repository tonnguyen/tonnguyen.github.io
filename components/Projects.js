import styles from '../styles/Projects.module.css';

const projects = [
  {
    name: 'Litium E-Commerce Platform',
    role: 'Team Leader',
    description:
      "Led the design and implementation of Litium's cloud-based e-commerce, PIM, and digital marketing platform, enabling scalable platform for B2B and B2C customers. Oversaw cross-functional teams and ensured delivery of high-quality features.",
    tech: ['Litium', '.NET', 'React', 'NextJS', 'Angular', 'Elastic Search'],
  },
  {
    name: 'EPiServer Commerce',
    role: 'Team Leader',
    description:
      'Directed the development of EPiServer Commerce, integrating advanced e-commerce capabilities with the EPiServer CMS. Focused on usability, extensibility, and seamless integration with Microsoft .NET technologies.',
    tech: ['EPiServer', '.NET', 'MVC', 'SQL Server'],
  },
  {
    name: 'Quicksilver Template',
    role: 'Lead Developer',
    description:
      'Developed the Quicksilver sample template to showcase the flexibility and power of the EPiServer Commerce platform, providing best practices for solution architects and developers.',
    tech: ['MVC', 'EPiServer', 'jQuery', 'LESS'],
  },
  {
    name: 'ManRay - Effective Dose Calculation',
    role: 'Web Developer',
    description:
      'Built an interactive web-based system for calculating whole body effective dose from radiographic procedures, supporting multi-platform desktop and web clients.',
    tech: ['Java', 'Spring', 'Hibernate', 'MySQL'],
  },
  {
    name: 'UpperMark FlashCard',
    role: 'Mobile Developer',
    description:
      'Created a cross-platform FlashCard application for CAIA exam preparation, supporting BlackBerry and Nokia devices, and integrating with web services.',
    tech: ['.NET', 'J2ME', 'BlackBerry SDK', 'SQL Server'],
  },
  {
    name: 'Border Gate Control System',
    role: 'Software Engineer',
    description:
      'Designed and developed a border gate control system for the Ministry of Defense of Vietnam, integrating passport/barcode readers and server synchronization.',
    tech: ['Java', 'Servlet', 'Oracle', 'Windows Service'],
  },
];

export default function Projects() {
  return (
    <section className={styles.projects} id="projects">
      <div className="container">
        <h2 className={styles.sectionTitle}>Key Projects</h2>
        <div className={styles.projectsGrid}>
          {projects.map((proj) => (
            <div className={styles.projectCard} key={proj.name}>
              <div className={styles.projectHeader}>
                <h3>{proj.name}</h3>
                <span className={styles.projectRole}>{proj.role}</span>
              </div>
              <p className={styles.projectDescription}>{proj.description}</p>
              <div className={styles.projectTech}>
                {proj.tech.map((t) => (
                  <span className={styles.techTag} key={t}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 