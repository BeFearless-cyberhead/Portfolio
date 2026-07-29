'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/types/portfolio';
import { Tag } from '@/components/shared/Tag';
import { MetricChip } from '@/components/shared/MetricChip';
import styles from './ProjectGrid.module.css';

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenModal: () => void;
}

export function ProjectCard({ project, index, onOpenModal }: ProjectCardProps) {
  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      {/* Thumbnail */}
      <div className={styles.cardThumb}>
        <img
          src={project.thumbnail}
          alt={`${project.title} project thumbnail`}
          loading="lazy"
          width={800}
          height={480}
        />
        <div className={styles.cardThumbOverlay} />
      </div>

      {/* Content */}
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.cardHook}>{project.hook}</p>

        {/* Metrics */}
        <div className={styles.cardMetrics}>
          {project.metrics.map(m => (
            <MetricChip key={m.label} value={m.value} label={m.label} />
          ))}
        </div>

        {/* Tags */}
        <div className={styles.cardTags}>
          {project.tags.map(tag => (
            <Tag key={tag} label={tag} />
          ))}
        </div>

        {/* Actions */}
        <div className={styles.cardActions}>
          <button onClick={onOpenModal} className={styles.cardCta}>
            View Architecture →
          </button>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
            >
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
