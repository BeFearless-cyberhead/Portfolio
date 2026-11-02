import styles from './HeroSection.module.css';
import { StatChips } from './StatChips';

export function HeroSection() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Portfolio · 秋</p>
        <h1 className={styles.name}>Ankit Maurya</h1>
        <p className={styles.typewriter}>Data Science &amp; AI Engineer</p>

        <p className={styles.lede}>
          I explore data, build useful machine-learning systems, and turn technical
          experiments into products people can understand and use.
        </p>

        <div className={styles.ctas}>
          <a href="#arsenal" className="btn btn--primary">
            Follow the path
          </a>
          <a
            href="https://linkedin.com/in/ankit-maurya-2123ab307"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost"
          >
            View LinkedIn
          </a>
        </div>

        <StatChips />
      </div>

      {/* Scroll cue — lantern anchor light */}
      <a href="#arsenal" className={styles.scrollCue} aria-label="Scroll to explore">
        <span className={styles.scrollCueLine} aria-hidden="true" />
        Scroll
      </a>
    </section>
  );
}
