'use client';

import styles from './VideoHub.module.css';
import sharedStyles from '@/components/shared/shared.module.css';

export function VideoHub() {
  // Feature flag — set to true when YouTube content is ready
  const isLive = false;

  return (
    <section id="content" className="section" aria-label="Video content">
      <div className={sharedStyles.sectionHeading}>
        <p className="section-label">Content Hub</p>
        <h2 className="section-title">Watch & Learn</h2>
        <p className="section-subtitle">
          Technical deep-dives, project walkthroughs, and engineering insights.
        </p>
      </div>

      {isLive ? (
        <div className={styles.videoGrid}>
          {/* YouTube iframes go here when live */}
        </div>
      ) : (
        <div className={styles.comingSoon}>
          <span className={styles.comingSoonIcon}>📹</span>
          <h3 className={styles.comingSoonTitle}>Coming Soon</h3>
          <p className={styles.comingSoonText}>
            Technical walkthroughs and project deep-dives are on the way.
          </p>
          <a
            href="https://youtube.com/@username"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.channelLink}
          >
            Subscribe on YouTube →
          </a>
        </div>
      )}
    </section>
  );
}
