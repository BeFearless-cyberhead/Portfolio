import { techStack } from '@/data/techStack';
import styles from './TechStack.module.css';

export function TechStack() {
  return (
    <section id="arsenal" className="section" aria-label="Technology arsenal">
      <div className="section__inner">
        <p className="section__eyebrow">01 · The Toolkit</p>
        <h2 className="section__title">Lanterns on the path</h2>
        <p className="section__intro">
          One connected toolkit for exploring data, building intelligent systems, and
          turning useful ideas into products people can use.
        </p>

        <ul className={styles.grid}>
          {techStack.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name} className={styles.card}>
                <span
                  className={styles.iconRing}
                  style={{ '--brand': item.color } as React.CSSProperties}
                  aria-hidden="true"
                >
                  <Icon />
                </span>
                <span className={styles.name}>{item.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
