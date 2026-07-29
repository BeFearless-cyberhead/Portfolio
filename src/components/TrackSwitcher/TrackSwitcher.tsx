'use client';

import { motion } from 'framer-motion';
import { useTrack } from '@/context/TrackContext';
import styles from './TrackSwitcher.module.css';

const TRACKS = [
  { id: 'data' as const, label: 'Data Analytics', icon: '◈' },
  { id: 'ai' as const, label: 'AI Engineering', icon: '◉' },
] as const;

export function TrackSwitcher() {
  const { activeTrack, setActiveTrack } = useTrack();

  return (
    <section id="track" className={styles.wrapper} aria-label="Track switcher">
      <nav aria-label="Filter projects by professional track" className={styles.switcher}>
        <div role="radiogroup" aria-label="Project track" className={styles.pill}>
          {TRACKS.map(t => (
            <button
              key={t.id}
              role="radio"
              aria-checked={activeTrack === t.id}
              onClick={() => setActiveTrack(t.id)}
              className={`${styles.btn} ${activeTrack === t.id ? styles.active : ''}`}
            >
              <span aria-hidden="true" className={styles.icon}>{t.icon}</span>
              {t.label}
              {activeTrack === t.id && (
                <motion.span
                  layoutId="switcher-indicator"
                  className={styles.indicator}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                />
              )}
            </button>
          ))}
        </div>
      </nav>
    </section>
  );
}
