'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTrack } from '@/context/TrackContext';
import { projects } from '@/data/projects';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import styles from './ProjectGrid.module.css';

const EASE = [0.34, 1.56, 0.64, 1] as const;

function EmptyState() {
  return (
    <div className={styles.empty}>
      <p>Nothing hung on this lantern yet — more projects coming soon.</p>
      <a
        href="https://github.com/BeFearless-cyberhead"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn--ghost"
      >
        Browse GitHub instead
      </a>
    </div>
  );
}

export function ProjectGrid() {
  const { activeTrack } = useTrack();
  const [openProject, setOpenProject] = useState<string | null>(null);

  const filtered = useMemo(
    () => projects.filter((p) => p.track === activeTrack),
    [activeTrack],
  );

  const selected = filtered.find((p) => p.id === openProject) ?? null;

  return (
    <section id="projects" className="section" aria-label="Featured projects">
      <div className="section__inner">
        <p className="section__eyebrow">02 · Featured Projects</p>
        <h2 className="section__title">Work I&rsquo;ve lit a path through</h2>
        <p className="section__intro">
          Each card opens the full story: the architecture, the code, and the numbers
          behind it.
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTrack}
            className={styles.grid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {filtered.length === 0 && <EmptyState />}
            {filtered.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                onOpen={() => setOpenProject(p.id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <ProjectModal project={selected} onClose={() => setOpenProject(null)} />
    </section>
  );
}
