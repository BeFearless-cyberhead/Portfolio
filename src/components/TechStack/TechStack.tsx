'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTrack } from '@/context/TrackContext';
import { techStack } from '@/data/techStack';
import styles from './TechStack.module.css';

const EASE = [0.34, 1.56, 0.64, 1] as const;

export function TechStack() {
  const { activeTrack } = useTrack();

  const visible = techStack.filter(
    (t) => t.track === activeTrack || t.track === 'shared',
  );

  return (
    <section id="arsenal" className="section" aria-label="Technology arsenal">
      <div className="section__inner">
        <p className="section__eyebrow">01 · The Arsenal</p>
        <h2 className="section__title">Lanterns on the path</h2>
        <p className="section__intro">
          Every tool I carry, lit for the track above. Shared foundations stay lit in
          both worlds.
        </p>

        <AnimatePresence mode="wait">
          <motion.ul
            key={activeTrack}
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {visible.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={`${activeTrack}-${item.name}`}
                  className={styles.card}
                  initial={{ opacity: 0, y: 18, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 60, duration: 0.35, ease: EASE }}
                >
                  <span
                    className={styles.iconRing}
                    style={{ '--brand': item.color } as React.CSSProperties}
                    aria-hidden="true"
                  >
                    <Icon />
                  </span>
                  <span className={styles.name}>{item.name}</span>
                </motion.li>
              );
            })}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  );
}
