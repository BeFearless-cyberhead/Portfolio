'use client';

import { ContactForm } from './ContactForm';
import styles from './ContactSection.module.css';
import sharedStyles from '@/components/shared/shared.module.css';

export function ContactSection() {
  return (
    <section id="contact" className="section" aria-label="Contact">
      <div className={sharedStyles.sectionHeading}>
        <p className="section-label">Get In Touch</p>
        <h2 className="section-title">Let&apos;s Connect</h2>
        <p className="section-subtitle">
          Have a project in mind, a question about my work, or just want to say hello?
        </p>
      </div>

      <div className={styles.contactGrid}>
        {/* Form */}
        <div className={styles.formWrapper}>
          <ContactForm />
        </div>

        {/* Info */}
        <div className={styles.infoPanel}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Connect Directly</h3>
            <div className={styles.infoLinks}>
              <a
                href="mailto:ankitmaurya@example.com"
                className={styles.infoLink}
              >
                <span className={styles.infoIcon} aria-hidden="true">@</span>
                ankitmaurya@example.com
              </a>
              <a
                href="https://github.com/ankitkumar"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.infoLink}
              >
                <span className={styles.infoIcon} aria-hidden="true">GH</span>
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/ankitkumar"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.infoLink}
              >
                <span className={styles.infoIcon} aria-hidden="true">in</span>
                LinkedIn
              </a>
            </div>
          </div>

          <div className={styles.responseNote}>
            <p>I typically respond within 24 hours.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
