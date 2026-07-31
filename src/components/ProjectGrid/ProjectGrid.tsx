'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTrack } from '@/context/TrackContext';
import { projects } from '@/data/projects';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import type { Project } from '@/types/portfolio';
import styles from './ProjectGrid.module.css';
import sharedStyles from '@/components/shared/shared.module.css';

export function ProjectGrid() {
  const { activeTrack } = useTrack();
  const [activeModal, setActiveModal] = useState<Project | null>(null);

  const filtered = useMemo(
    () => projects.filter(p => p.track === activeTrack),
    [activeTrack]
  );

  return (
    <section id="projects" aria-label="Featured projects" className="section">
      <div className={sharedStyles.sectionHeading}>
        <p className="section-label">Featured Projects</p>
        <h2 className="section-title">What I&apos;ve Built</h2>
        <p className="section-subtitle">
          Real systems solving real problems — each with measurable outcomes and production-grade architecture.
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTrack}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          className={styles.grid}
        >
          {filtered.length === 0 && (
            <div className={styles.empty}>
              <p className={styles.emptyIcon}>🔬</p>
              <p className={styles.emptyTitle}>More projects coming soon</p>
              <p className={styles.emptyText}>
                Check out my GitHub for the latest work in this track.
              </p>
              <a
                href="https://github.com/ankitkumar"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.emptyLink}
              >
                View GitHub →
              </a>
            </div>
          )}
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              onOpenModal={() => setActiveModal(p)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {activeModal && (
          <ProjectModal
            project={activeModal}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
