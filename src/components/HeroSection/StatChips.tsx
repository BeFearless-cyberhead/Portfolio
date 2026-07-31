'use client';

import type { PortfolioStat } from '@/types/portfolio';
import styles from './StatChips.module.css';

// Static fallback data (from PRD Section 3.2)
const FALLBACK_STATS: PortfolioStat[] = [
  { key: 'hackathons_won', value: '5', label: 'Hackathons Won' },
  { key: 'ai_systems', value: '2', label: 'AI Systems in Production' },
  { key: 'data_processed', value: '10K+', label: 'Rows Processed Daily' },
];

export function StatChips() {
  // Use static fallback — Supabase integration can be added later
  const stats = FALLBACK_STATS;

  return (
    <div className={styles.chips}>
      {stats.map(stat => (
        <div key={stat.key} className={styles.chip}>
          <span className={styles.chipValue}>{stat.value}</span>
          <span className={styles.chipLabel}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
