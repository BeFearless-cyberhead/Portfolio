'use client';

import Image from 'next/image';
import type { Project } from '@/types/portfolio';
import styles from './ProjectGrid.module.css';

interface Props {
  project: Project;
  index: number;
  onOpen: () => void;
}

export function ProjectCard({ project: p, index, onOpen }: Props) {
  return (
    <article className={styles.card}>
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
            sizes="(max-width: 760px) calc(100vw - 56px), (max-width: 894px) 340px, (max-width: 1158px) 38vw, 440px"
            className={styles.thumb}
          />
          <span className={styles.thumbVeil} aria-hidden="true" />
          <span className={styles.thumbIndex} aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        </span>

        <span className={styles.cardBody}>
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
            {p.tags.slice(0, 3).map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
            {p.tags.length > 3 && (
              <span className="tag" aria-label={`${p.tags.length - 3} more tools in the case study`}>
                +{p.tags.length - 3}
              </span>
            )}
          </span>

          <span className={styles.cardCta}>
            <span>Open case study</span>
            <span className={styles.ctaArrow} aria-hidden="true">
              →
            </span>
          </span>
        </span>
      </button>
    </article>
  );
}
