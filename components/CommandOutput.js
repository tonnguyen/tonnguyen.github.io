'use client';
import { ExternalLink, Folder, Briefcase } from 'lucide-react';
import { SkateboardsList, BuySkateboard } from './SkateboardsList';
import styles from '../styles/Terminal.module.css';

export function CommandOutput({ type, index }) {
  switch (type) {
    case 'whoami':
      return <WhoAmIOutput />;
    case 'projects':
      return <ProjectsOutput />;
    case 'skills':
      return <SkillsOutput />;
    case 'contact':
      return <ContactOutput />;
    case 'experience':
      return <ExperienceOutput />;
    case 'skateboards':
      return <SkateboardsList />;
    case 'buy':
      return <BuySkateboard index={index} />;
    default:
      return null;
  }
}

function WhoAmIOutput() {
  return (
    <div className={styles.commandOutput} style={{ marginBottom: '0.5rem' }}>
      <div className={styles.outputText}>
        <span className={styles.outputLabel}>Name:</span> Ton Nguyen
      </div>
      <div className={styles.outputText}>
        <span className={styles.outputLabel}>Role:</span> Team Leader
      </div>
      <div className={styles.outputText}>
        <span className={styles.outputLabel}>Company:</span> Litium
      </div>
      <div className={styles.outputText}>
        <span className={styles.outputLabel}>Location:</span> Stockholm, Sweden
      </div>
      <div className={styles.outputSecondary} style={{ marginTop: '0.75rem' }}>
        Team Leader with extensive experience in e-commerce platforms, mobile development,
        <br />
        and modern web technologies. Proven track record in leading high-performing development
        <br />
        teams with strong technical background in .NET, React, Angular, and e-commerce platforms.
      </div>
      <div className={styles.outputSecondary} style={{ marginTop: '0.5rem' }}>
        <div className={styles.outputLabel} style={{ marginBottom: '0.25rem' }}>Education:</div>
        <div style={{ paddingLeft: '1rem' }}>
          <div>• BSc in Computing - University of Greenwich (2009-2010)</div>
          <div>• Higher Diploma in Software Engineering - FPT-Aptech (2004-2007)</div>
        </div>
      </div>
    </div>
  );
}

function ProjectsOutput() {
  const projects = [
    {
      name: 'litium-platform',
      description: 'Cloud-based e-commerce, PIM, and digital marketing platform',
      tech: 'Litium, .NET, React, NextJS, Angular, Elastic Search',
      link: 'https://www.litium.com'
    },
    {
      name: 'episerver-commerce',
      description: 'Advanced e-commerce platform integrated with EPiServer CMS',
      tech: 'EPiServer, .NET, MVC, SQL Server',
      link: '#'
    },
    {
      name: 'quicksilver-template',
      description: 'Sample template showcasing EPiServer Commerce best practices',
      tech: 'MVC, EPiServer, jQuery, LESS',
      link: '#'
    },
    {
      name: 'effective-dose-calculator',
      description: 'Web-based system for radiographic dose calculations',
      tech: 'Java, Spring, Hibernate, MySQL',
      link: '#'
    },
    {
      name: 'caia-flashcard-app',
      description: 'Cross-platform FlashCard app for CAIA exam preparation',
      tech: '.NET, J2ME, BlackBerry SDK, SQL Server',
      link: '#'
    },
    {
      name: 'border-gate-control',
      description: 'Border control system for Ministry of Defense of Vietnam',
      tech: 'Java, Servlet, Oracle, Windows Service',
      link: '#'
    }
  ];

  return (
    <div className={styles.projectList}>
      {projects.map((project, index) => (
        <div key={index} className={styles.projectItem}>
          <div className={styles.projectHeader}>
            <Folder className={styles.projectIcon} />
            <span className={styles.projectName}>{project.name}/</span>
            {project.link !== '#' && (
              <a 
                href={project.link}
                className={styles.projectLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className={styles.projectLinkIcon} />
              </a>
            )}
          </div>
          <div className={styles.projectDescription}>
            {project.description}
          </div>
          <div className={styles.projectTech}>
            {project.tech}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsOutput() {
  const skills = {
    'Programming Languages': [
      { name: 'C#', level: 'Expert' },
      { name: 'JavaScript', level: 'Expert' },
      { name: 'Java', level: 'Advanced' }
    ],
    'Web Technologies': [
      { name: '.NET', level: 'Expert' },
      { name: 'React', level: 'Expert' },
      { name: 'Angular', level: 'Expert' },
      { name: 'NextJS', level: 'Advanced' }
    ],
    'Mobile Development': [
      { name: 'React Native', level: 'Advanced' },
      { name: 'Android', level: 'Advanced' },
      { name: 'Expo', level: 'Intermediate' }
    ],
    'E-commerce & CMS': [
      { name: 'Litium', level: 'Expert' },
      { name: 'EPiServer Commerce', level: 'Expert' },
      { name: 'EPiServer CMS', level: 'Expert' }
    ],
    'Databases & Search': [
      { name: 'SQL Server', level: 'Advanced' },
      { name: 'Elastic Search', level: 'Advanced' },
      { name: 'Oracle', level: 'Intermediate' },
      { name: 'MySQL', level: 'Intermediate' }
    ]
  };

  return (
    <div className={styles.skillsList}>
      {Object.entries(skills).map(([category, items]) => (
        <div key={category} className={styles.skillCategory}>
          <div className={styles.skillCategoryTitle}>[{category}]</div>
          <div className={styles.skillItems}>
            {items.map((skill, index) => (
              <div key={index} className={styles.skillItem}>
                <span className={styles.skillCheckmark}>✓</span>
                <span className={styles.skillName}>{skill.name}</span>
                <span className={styles.skillLevel}>({skill.level})</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceOutput() {
  const experiences = [
    {
      company: 'Litium',
      role: 'Team Leader',
      period: 'Dec 2016 - Present',
      location: 'Stockholm, Sweden',
      responsibilities: [
        'Lead and mentor cross-functional development team',
        'Drive delivery of scalable e-commerce platform for B2B and B2C customers',
        'Collaborate with Product Managers, UX, and teams across locations',
        'Coach and support professional growth of team members'
      ],
      tech: 'Litium, .NET, SQL Server, React, NextJS, Angular, Elastic Search'
    },
    {
      company: 'EPiServer',
      role: 'Team Leader - Commerce',
      period: 'Feb 2012 - Mar 2016',
      location: 'Hanoi, Vietnam',
      responsibilities: [
        'Led Commerce development team for EPiServer Commerce platform',
        'Managed Hanoi team and coordinated with Stockholm headquarters',
        'Contributed to technology and solution decisions',
        'Oversaw resource management and project planning'
      ],
      tech: 'EPiServer CMS, EPiServer Commerce, SQL Server, jQuery, LESS, Dojo'
    },
    {
      company: 'EPiServer',
      role: 'Senior Developer',
      period: 'Jun 2009 - Feb 2012',
      location: 'Hanoi, Vietnam',
      responsibilities: [
        'Developed and maintained EPiServer CMS platform',
        'Collaborated with Stockholm-based developers on CMS 7',
        'Enhanced developer and editor experiences',
        'Contributed to CMS 6.x maintenance and new features'
      ],
      tech: 'EPiServer CMS, SQL Server, jQuery, Dojo'
    },
    {
      company: 'Freelance',
      role: 'Mobile Developer',
      period: '2007 - 2009',
      location: 'Vietnam',
      responsibilities: [
        'Designed cross-platform mobile applications',
        'Published apps on Android, iOS, and BlackBerry platforms',
        'Managed full app lifecycle from concept to deployment'
      ],
      tech: 'Java, Xamarin, Cordova, BlackBerry SDK'
    }
  ];

  return (
    <div className={styles.experienceList}>
      {experiences.map((exp, index) => (
        <div key={index} className={styles.experienceItem}>
          <div className={styles.experienceHeader}>
            <Briefcase className={styles.experienceIcon} />
            <span className={styles.experienceCompany}>{exp.company}</span>
            <span className={styles.experienceRole}>- {exp.role}</span>
          </div>
          <div className={styles.experienceDetails}>
            <div className={styles.experiencePeriod}>
              {exp.period} | {exp.location}
            </div>
            <div className={styles.experienceResponsibilities}>
              {exp.responsibilities.map((resp, idx) => (
                <div key={idx} className={styles.experienceResponsibility}>• {resp}</div>
              ))}
            </div>
            <div className={styles.experienceTech}>
              {exp.tech}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactOutput() {
  return (
    <div className={styles.contactOutput}>
      <pre className={styles.contactJson}>
        <span className={styles.jsonBrace}>{'{'}</span>
        {'\n  '}<span className={styles.jsonKey}>"github"</span>: <span className={styles.jsonString}>"github.com/tonnguyen"</span>,
        {'\n  '}<span className={styles.jsonKey}>"linkedin"</span>: <span className={styles.jsonString}>"linkedin.com/in/tonnguyen"</span>,
        {'\n  '}<span className={styles.jsonKey}>"website"</span>: <span className={styles.jsonString}>"tonnguyen.github.io"</span>,
        {'\n  '}<span className={styles.jsonKey}>"location"</span>: <span className={styles.jsonString}>"Stockholm, Sweden"</span>
        {'\n'}<span className={styles.jsonBrace}>{'}'}</span>
      </pre>
    </div>
  );
}
