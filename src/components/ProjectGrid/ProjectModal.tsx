'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import type { Project } from '@/types/portfolio';
import { Tag } from '@/components/shared/Tag';
import { MetricChip } from '@/components/shared/MetricChip';
import styles from './ProjectModal.module.css';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Focus trap
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }, [onClose]);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement;
    document.body.classList.add('scroll-locked');
    document.addEventListener('keydown', handleKeyDown);

    // Focus first element
    const timer = setTimeout(() => {
      const firstFocusable = modalRef.current?.querySelector<HTMLElement>('button');
      firstFocusable?.focus();
    }, 100);

    return () => {
      document.body.classList.remove('scroll-locked');
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      previousFocus.current?.focus();
    };
  }, [handleKeyDown]);

  const modalContent = (
    <>
      {/* Overlay */}
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <motion.div
        ref={modalRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} details`}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Close button */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <h2 className={styles.title}>{project.title}</h2>
            <div className={styles.metrics}>
              {project.metrics.map(m => (
                <MetricChip key={m.label} value={m.value} label={m.label} />
              ))}
            </div>
          </div>

          {/* Description */}
          <div className={styles.description}>
            {project.modal.description.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Tags */}
          <div className={styles.tags}>
            {project.tags.map(tag => (
              <Tag key={tag} label={tag} />
            ))}
          </div>

          {/* Architecture */}
          <div className={styles.architecture}>
            <h3 className={styles.sectionTitle}>Architecture</h3>
            <div className={styles.archDiagram}>
              <img
                src={project.modal.architecture}
                alt={`${project.title} architecture diagram`}
                width={800}
                height={400}
                loading="lazy"
              />
            </div>
          </div>

          {/* Code Snippet */}
          {project.modal.codeSnippet && (
            <div className={styles.codeSection}>
              <h3 className={styles.sectionTitle}>Key Implementation</h3>
              <pre className={styles.codeBlock}>
                <code>{project.modal.codeSnippet.code}</code>
              </pre>
              {project.modal.codeSnippet.caption && (
                <p className={styles.codeCaption}>{project.modal.codeSnippet.caption}</p>
              )}
            </div>
          )}

          {/* Links */}
          <div className={styles.links}>
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkBtn}
              >
                View on GitHub ↗
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkBtn}
              >
                Live Demo ↗
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );

  return createPortal(modalContent, document.body);
}
