'use client';

import { useEffect, useState } from 'react';
import styles from '../HeroSection/HeroSection.module.css';

const ROLES = [
  'AI Systems Engineer',
  'Data Analytics Lead',
  'LangGraph Architect',
] as const;

/**
 * Cycles through job titles character-by-character
 * (80ms/char, 2s hold before erase). All state transitions happen
 * inside timer callbacks (never synchronously in the effect body),
 * which keeps rendering predictable.
 * Respects prefers-reduced-motion: settles on the first role with no loop.
 */
export function TypewriterEffect() {
  const [text, setText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'holding' | 'erasing'>('typing');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const current = ROLES[roleIndex];

    if (reduced) {
      // Static end-state: show the first role, run no loop
      if (text !== current) {
        const hop = setTimeout(() => setText(current), 16);
        return () => clearTimeout(hop);
      }
      return;
    }

    let t: ReturnType<typeof setTimeout> | undefined;

    if (phase === 'typing') {
      if (text.length < current.length) {
        t = setTimeout(() => setText(current.slice(0, text.length + 1)), 80);
      } else {
        t = setTimeout(() => setPhase('holding'), 2000);
      }
    } else if (phase === 'holding') {
      t = setTimeout(() => setPhase('erasing'), 2000);
    } else {
      // erasing
      if (text.length > 0) {
        t = setTimeout(() => setText(current.slice(0, text.length - 1)), 40);
      } else {
        t = setTimeout(() => {
          setRoleIndex((i) => (i + 1) % ROLES.length);
          setPhase('typing');
        }, 240);
      }
    }

    return () => t && clearTimeout(t);
  }, [text, phase, roleIndex]);

  return (
    <p className={styles.typewriter}>
      {/* Screen readers: announce the stable role list, skip the animation */}
      <span className={styles.visuallyHidden}>Available roles I take on:</span>
      <span aria-hidden="true">
        <span className={styles.typewriterText}>{text}</span>
        <span className={styles.typewriterCaret} />
      </span>
    </p>
  );
}
