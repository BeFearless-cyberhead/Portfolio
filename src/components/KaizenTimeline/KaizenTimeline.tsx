import { kaizenNodes } from '@/data/kaizenNodes';
import styles from './KaizenTimeline.module.css';

/**
 * The hackathon leadership story, top-to-bottom like a temple path.
 * Each node is a milestone with its measurable outcome.
 */
export function KaizenTimeline() {
  return (
    <section id="kaizen" className="section" aria-label="Kaizen leadership timeline">
      <div className="section__inner">
        <p className="section__eyebrow">04 · Kaizen</p>
        <h2 className="section__title">Climbing in stages</h2>
        <p className="section__intro">
          Leading a five-person team from scope to podium in one hackathon — the
          continuous-improvement path, milestone by milestone.
        </p>

        <ol className={styles.rail}>
          {kaizenNodes.map((node, i) => (
            <li key={node.id} className={styles.step}>
              {/* Node — gold milestone marker on the stone path */}
              <span className={styles.marker} aria-hidden="true">
                <span className={styles.markerCore} />
              </span>

              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.stepNum} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className={styles.stepTitle}>{node.title}</h3>
                    <p className={styles.stepMeta}>
                      {node.dateRange} · Team of {node.teamSize}
                    </p>
                  </div>
                </div>
                <p className={styles.stepRole}>{node.role}</p>
                <p className={styles.stepOutcome}>
                  <span className={styles.stepOutcomeLabel}>Outcome</span> {node.outcome}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Top-3 result plaque */}
        <p className={styles.resultPlaque}>
          <span className={styles.resultGlyph} aria-hidden="true">受</span>
          Top 3 finish among 20+ teams — the whole path walked in 36 hours.
        </p>
      </div>
    </section>
  );
}
