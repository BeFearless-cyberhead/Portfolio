'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import styles from './Navigation.module.css';

const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'arsenal', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'kaizen', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }
    return () => document.body.classList.remove('scroll-locked');
  }, [mobileOpen]);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={styles.navInner}>
          <a href="#hero" className={styles.logo} onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}>
            <span className={styles.logoAccent}>{'<'}</span>
            Portfolio
            <span className={styles.logoAccent}>{' />'}</span>
          </a>

          <div className={styles.navLinks}>
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={styles.navLink}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className={styles.navActions}>
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={styles.themeIcon}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </motion.span>
            </button>

            <button
              className={styles.hamburger}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.line1Open : ''}`} />
              <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.line2Open : ''}`} />
              <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.line3Open : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className={styles.drawer}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className={styles.drawerContent}>
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={styles.drawerLink}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    {link.label}
                  </motion.button>
                ))}

                <div className={styles.drawerSocials}>
                  <a href="https://github.com/ankitmaurya" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    GitHub ↗
                  </a>
                  <a href="https://linkedin.com/in/ankitmaurya" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    LinkedIn ↗
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
