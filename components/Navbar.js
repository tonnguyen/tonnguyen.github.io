"use client";
import styles from '../styles/Navbar.module.css';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = navLinks.map(link => link.href.replace('#', ''));
      let current = sectionIds[0];
      for (let id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - 80;
          if (window.scrollY >= top) {
            current = id;
          }
        }
      }
      setActive(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.navLogo}>TN</div>
        <ul className={`${styles.navMenu} ${open ? styles.active : ''}`}>
          {navLinks.map(link => (
            <li className={styles.navItem} key={link.href}>
              <a
                href={link.href}
                className={
                  styles.navLink + (active === link.href.replace('#', '') ? ' ' + styles.active : '')
                }
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.navRight}>
          <div className={styles.themeToggleContainer}>
            <ThemeToggle />
          </div>
          <div className={`${styles.hamburger} ${open ? styles.active : ''}`} onClick={() => setOpen(!open)}>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </div>
        </div>
      </div>
    </nav>
  );
} 