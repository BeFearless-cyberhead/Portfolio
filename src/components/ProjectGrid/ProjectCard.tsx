'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Project } from '@/types/portfolio';
import styles from './ProjectGrid.module.css';

interface Props {
  project: Project;
  index: number;
  onOpen: () => void;
}

const EASE = [0.34, 1.56, 0.64, 1] as const;

export function ProjectCard({ project: p, index, onOpen }: Props) {
  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 60, duration: 0.4, ease: EASE }}
    >
      <button
        type="button"
        className={styles.cardButton}
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`Open project details: ${p.title}`}
      >
        {/* Thumbnail — melts into the panel instead of sitting as a boxed
            screenshot; the veil carries the card's panel tone at the bottom */}
        <span className={styles.thumbWrap}>
          <Image
            src={p.thumbnail}
            alt={`${p.title} thumbnail`}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.thumb}
          />
          <span className={styles.thumbVeil} aria-hidden="true" />
          <span className={styles.thumbIndex} aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        </span>

        <span className={styles.cardBody}>
          <span className={styles.cardEyebrow} aria-hidden="true">
            {String(index + 1).padStart(2, '0')} &middot; Architecture story
          </span>
          <h3 className={styles.cardTitle}>{p.title}</h3>
          <p className={styles.cardHook}>{p.hook}</p>

          {/* Stat strip — the numbers lead, hairline-divided like a ledger */}
          <span className={styles.cardStats}>
            {p.metrics.map((m) => (
              <span key={m.label} className={styles.stat}>
                <b>{m.value}</b>
                <span>{m.label}</span>
              </span>
            ))}
          </span>

          <span className={styles.cardTags}>
            {p.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </span>

          <span className={styles.cardCta}>
            <span>View architecture</span>
            <span className={styles.ctaArrow} aria-hidden="true">
              →
            </span>
          </span>
        </span>
      </button>
    </motion.article>
  );
}
