'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './TypewriterEffect.module.css';

interface TypewriterEffectProps {
  strings: string[];
  typingSpeed?: number;
  pauseDuration?: number;
  maxCycles?: number;
}

export function TypewriterEffect({
  strings,
  typingSpeed = 80,
  pauseDuration = 2000,
  maxCycles = 3,
}: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [stringIndex, setStringIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const cycleCount = useRef(0);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion.current) {
      setDisplayText(strings[0]);
      setIsComplete(true);
    }
  }, [strings]);

  useEffect(() => {
    if (isComplete || prefersReducedMotion.current) return;

    const currentString = strings[stringIndex];

    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentString.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentString.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, typingSpeed / 2);
      } else {
        const nextIndex = (stringIndex + 1) % strings.length;
        if (nextIndex === 0) {
          cycleCount.current++;
          if (cycleCount.current >= maxCycles) {
            setDisplayText(strings[0]);
            setIsComplete(true);
            return;
          }
        }
        setStringIndex(nextIndex);
        setIsDeleting(false);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, stringIndex, strings, typingSpeed, pauseDuration, maxCycles, isComplete]);

  return (
    <span className={styles.typewriter}>
      {displayText}
      {!isComplete && <span className={styles.cursor}>|</span>}
    </span>
  );
}
