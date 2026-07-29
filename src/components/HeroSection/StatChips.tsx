'use client';

import { MetricChip } from '@/components/shared/MetricChip';
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
        <MetricChip
          key={stat.key}
          value={stat.value}
          label={stat.label}
        />
      ))}
    </div>
  );
}
