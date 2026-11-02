'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Navigation.module.css';

const LINKS = [
  { href: '#arsenal', label: 'Toolkit' },
  { href: '#projects', label: 'Projects' },
  { href: '#notes', label: 'Notes' },
  { href: '#kaizen', label: 'Kaizen' },
  { href: '#contact', label: 'Contact' },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key !== 'Tab') return;

      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia('(min-width: 961px)');
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onDesktop);
      trigger?.focus({ preventScroll: true });
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
            ref={triggerRef}
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
      <button
        type="button"
        className={styles.backdrop}
        hidden={!open}
        tabIndex={-1}
        aria-label="Dismiss navigation"
        onClick={close}
      />
      <div
        ref={drawerRef}
        id="mobile-drawer"
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        hidden={!open}
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerLabel}>The night path</span>
          <button ref={closeRef} type="button" className={styles.drawerClose} onClick={close} aria-label="Close navigation">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <ul className={styles.drawerLinks}>
          {LINKS.map((l) => (
            <li key={l.href}>
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
