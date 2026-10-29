'use client';

import { useEffect, useState } from 'react';
import type { PortfolioStat } from '@/types/portfolio';
import { supabase } from '@/lib/supabase';
import styles from '../HeroSection/HeroSection.module.css';

/* Static fallback per the PRD: LPB (quiet failure) — never show the user an error here */
const FALLBACK: PortfolioStat[] = [
  { key: 'hackathons_won', value: '5', label: 'Hackathons Won' },
  { key: 'ai_systems', value: '2', label: 'AI Systems in Production' },
  { key: 'data_processed', value: '10K+', label: 'Rows Processed Daily' },
];

export function StatChips() {
  const [stats, setStats] = useState<PortfolioStat[]>(FALLBACK);

  useEffect(() => {
    if (!supabase) return; // no env configured — static fallback stands
    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_stats')
          .select('key, value, label');

        if (cancelled) return;
        if (error || !data?.length) return; // silently keep fallback
        setStats(data);
      } catch {
        /* keep fallback */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ul className={styles.chips}>
      {stats.map((s) => (
        <li key={s.key} className="chip">
          <b>{s.value}</b>
          <span>{s.label}</span>
        </li>
      ))}
    </ul>
  );
}
