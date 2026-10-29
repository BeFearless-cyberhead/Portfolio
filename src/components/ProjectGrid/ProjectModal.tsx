'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { Project } from '@/types/portfolio';
import styles from './ProjectModal.module.css';

const EASE = [0.34, 1.56, 0.64, 1] as const;

interface Props {
  project: Project | null;
  onClose: () => void;
}

/**
 * Portal-mounted glass dialog. Focus is trapped while open, ESC closes,
 * and focus returns to the invoking element (handled by the store of the
 * last-focused trigger in the document body via data attribute game below).
 */
export function ProjectModal({ project: p, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus trap + ESC
  useEffect(() => {
    if (!p) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    panel?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && panel) {
        const focusables = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), pre[tabindex], [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [p, onClose]);

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={p.title}
            tabIndex={-1}
            className={`${styles.panel} glass`}
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <header className={styles.header}>
              <div>
                <h3 className={styles.title}>{p.title}</h3>
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.repoLink}
                  >
                    View on GitHub ↗
                  </a>
                )}
              </div>
              <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="Close project details"
              >
                ✕
              </button>
            </header>

            <div className={styles.metrics}>
              {p.metrics.map((m) => (
                <span key={m.label} className="chip">
                  <b>{m.value}</b>
                  <span>{m.label}</span>
                </span>
              ))}
            </div>

            <div className={styles.body}>
              <div className={styles.reading}>
                <p className={styles.description}>{p.modal.description}</p>

                {p.modal.architecture && (
                  <figure className={styles.arch}>
                    <Image
                      src={p.modal.architecture}
                      alt={`Architecture diagram for ${p.title}`}
                      width={800}
                      height={450}
                      className={styles.archImg}
                    />
                    <figcaption className={styles.archCaption}>
                      Architecture flow
                    </figcaption>
                  </figure>
                )}

                {p.modal.codeSnippet && (
                  <figure className={styles.code}>
                    <figcaption className={styles.codeCaption}>
                      {p.modal.codeSnippet.caption}
                    </figcaption>
                    <pre tabIndex={0} className={styles.codeBlock}>
                      <code>{p.modal.codeSnippet.code}</code>
                    </pre>
                  </figure>
                )}
              </div>

              <aside className={styles.side}>
                <p className={styles.sideLabel}>Built with</p>
                <div className={styles.sideTags}>
                  {p.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn--primary ${styles.liveCta}`}
                  >
                    Open live demo
                  </a>
                )}
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
