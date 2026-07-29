'use client';

import { motion } from 'framer-motion';
import { kaizenNodes } from '@/data/kaizenNodes';
import styles from './KaizenTimeline.module.css';
import sharedStyles from '@/components/shared/shared.module.css';

export function KaizenTimeline() {
  return (
    <section id="kaizen" className="section" aria-label="Leadership journey">
      <div className={sharedStyles.sectionHeading}>
        <p className="section-label">Kaizen Leadership</p>
        <h2 className="section-title">The Journey</h2>
        <p className="section-subtitle">
          From team formation to winning presentation — continuous improvement in action.
        </p>
      </div>

      <div className={styles.timeline}>
        {/* Connecting line */}
        <div className={styles.line} aria-hidden="true" />

        {kaizenNodes.map((node, i) => (
          <motion.div
            key={node.id}
            className={styles.node}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              delay: i * 0.1,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            {/* Node dot */}
            <div className={styles.dot}>
              <span className={styles.dotInner}>{node.id}</span>
            </div>

            {/* Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{node.title}</h3>
                <span className={styles.dateRange}>{node.dateRange}</span>
              </div>
              <p className={styles.role}>{node.role}</p>
              <div className={styles.cardMeta}>
                <span className={styles.teamSize}>
                  👥 {node.teamSize} members
                </span>
              </div>
              <p className={styles.outcome}>
                <span className={styles.outcomeLabel}>Outcome:</span> {node.outcome}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
