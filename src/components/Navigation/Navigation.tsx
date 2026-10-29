'use client';

import { useEffect, useState } from 'react';
import styles from './Navigation.module.css';

const LINKS = [
  { href: '#projects', label: 'Projects' },
  { href: '#arsenal', label: 'Arsenal' },
  { href: '#kaizen', label: 'Kaizen' },
  { href: '#contact', label: 'Contact' },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <nav className={styles.inner} aria-label="Primary">
          <a href="#main-content" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              安
            </span>
            <span className={styles.brandName}>Ankit Maurya</span>
          </a>

          <ul className={styles.links}>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={styles.link}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className={styles.cta}>
                Get in touch
              </a>
            </li>
          </ul>

          <button
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`${styles.burgerBar} ${open ? styles.barOpen1 : ''}`} />
            <span className={`${styles.burgerBar} ${open ? styles.barOpen2 : ''}`} />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        hidden={!open}
      >
        <ul className={styles.drawerLinks}>
          {LINKS.map((l, i) => (
            <li key={l.href} style={{ transitionDelay: `${i * 40}ms` }}>
              <a href={l.href} className={styles.drawerLink} onClick={close}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.drawerSocial}>
          <a
            href="https://github.com/BeFearless-cyberhead"
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/ankit-maurya-2123ab307"
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </>
  );
}
