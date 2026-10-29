import { Navigation } from '@/components/Navigation/Navigation';
import { HeroSection } from '@/components/HeroSection/HeroSection';
import { TempleBackground } from '@/components/TempleBackground/TempleBackground';
import { TrackSwitcher } from '@/components/TrackSwitcher/TrackSwitcher';
import { TechStack } from '@/components/TechStack/TechStack';
import { ProjectGrid } from '@/components/ProjectGrid/ProjectGrid';
import { KaizenTimeline } from '@/components/KaizenTimeline/KaizenTimeline';
import { ContactSection } from '@/components/ContactSection/ContactSection';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      {/* The living Kyoto night-temple scene: fixed behind everything */}
      <TempleBackground />

      <Navigation />

      <HeroSection />
      <TrackSwitcher />
      <TechStack />
      <ProjectGrid />
      <KaizenTimeline />
      <ContactSection />

      {/* Footer — the evening gate */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerMark} aria-hidden="true">
            夜の道 · The night path
          </p>
          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} Ankit Maurya · Built with Next.js, TypeScript, Three.js &amp; Supabase
          </p>
          <nav className={styles.footerLinks} aria-label="Social links">
            <a href="https://github.com/BeFearless-cyberhead" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/ankit-maurya-2123ab307" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
