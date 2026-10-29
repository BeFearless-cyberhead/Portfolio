'use client';

import { motion } from 'framer-motion';
import { useTrack } from '@/context/TrackContext';
import styles from './TrackSwitcher.module.css';

const TRACKS = [
  { id: 'data' as const, label: 'Data Analytics', glyph: '◈' },
  { id: 'ai' as const, label: 'AI Engineering', glyph: '◉' },
] as const;

export function TrackSwitcher() {
  const { activeTrack, setActiveTrack } = useTrack();

  return (
    <section id="track" className={`section ${styles.strip}`} aria-label="Project track filter">
      <div className={styles.inner}>
        <nav
          className={styles.radiogroupWrap}
          role="radiogroup"
          aria-label="Project track"
        >
          {TRACKS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={activeTrack === t.id}
              onClick={() => setActiveTrack(t.id)}
              className={`${styles.radio} ${activeTrack === t.id ? styles.radioActive : ''}`}
            >
              <span aria-hidden="true" className={styles.glyph}>
                {t.glyph}
              </span>
              {t.label}
              {activeTrack === t.id && (
                <motion.span
                  layoutId="track-indicator"
                  className={styles.indicator}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                />
              )}
            </button>
          ))}
        </nav>
        <p className={styles.hint}>Switch the lantern — the path shows what it&rsquo;s lit for.</p>
      </div>
    </section>
  );
}
