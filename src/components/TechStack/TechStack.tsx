'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrack } from '@/context/TrackContext';
import { techStack } from '@/data/techStack';
import styles from './TechStack.module.css';
import sharedStyles from '@/components/shared/shared.module.css';

export function TechStack() {
  const { activeTrack } = useTrack();

  const filtered = useMemo(() =>
    techStack.filter(t => t.track === activeTrack || t.track === 'shared'),
    [activeTrack]
  );

  return (
    <section id="arsenal" className="section" aria-label="Technical skills">
      <div className={sharedStyles.sectionHeading}>
        <p className="section-label">Tech Arsenal</p>
        <h2 className="section-title">Tools & Technologies</h2>
        <p className="section-subtitle">
          The instruments I use to turn data into decisions and ideas into production systems.
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTrack}
          className={styles.grid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filtered.map((tech, i) => {
            const IconComponent = tech.icon;
            return (
              <motion.div
                key={`${tech.name}-${tech.track}`}
                className={sharedStyles.techCard}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: i * 0.04,
                  duration: 0.35,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                <span
                  className={sharedStyles.techIcon}
                  aria-hidden="true"
                  style={{ background: `linear-gradient(135deg, ${tech.color}, ${tech.color}dd)` }}
                >
                  <IconComponent size={22} color="#fff" />
                </span>
                <span className={sharedStyles.techName}>{tech.name}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
