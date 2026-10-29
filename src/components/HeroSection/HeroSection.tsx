'use client';

import styles from './HeroSection.module.css';
import { StatChips } from './StatChips';
import { TypewriterEffect } from './TypewriterEffect';

export function HeroSection() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Portfolio · 秋</p>
        <h1 className={styles.name}>Ankit Maurya</h1>
        <TypewriterEffect />

        <p className={styles.lede}>
          I build AI systems that hold up in production — LangGraph pipelines,
          data engineering, and dashboards people actually use.
        </p>

        <StatChips />

        <div className={styles.ctas}>
          <a href="#track" className="btn btn--primary">
            Explore Architectures
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost"
          >
            Download Resume
          </a>
        </div>
      </div>

      {/* Scroll cue — lantern anchor light */}
      <a href="#track" className={styles.scrollCue} aria-label="Scroll to explore">
        <span className={styles.scrollCueLine} aria-hidden="true" />
        Scroll
      </a>
    </section>
  );
}
