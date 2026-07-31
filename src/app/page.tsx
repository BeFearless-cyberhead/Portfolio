import { Navigation } from '@/components/Navigation/Navigation';
import { HeroSection } from '@/components/HeroSection/HeroSection';
import { TrackSwitcher } from '@/components/TrackSwitcher/TrackSwitcher';
import { TechStack } from '@/components/TechStack/TechStack';
import { ProjectGrid } from '@/components/ProjectGrid/ProjectGrid';
import { KaizenTimeline } from '@/components/KaizenTimeline/KaizenTimeline';
import { ContactSection } from '@/components/ContactSection/ContactSection';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <Navigation />
      <HeroSection />
      <TrackSwitcher />
      <TechStack />
      <ProjectGrid />
      <KaizenTimeline />
      <ContactSection />

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} Ankit Maurya · Built with Next.js, TypeScript &amp; Supabase
          </p>
          <div className={styles.footerLinks}>
            <a href="https://github.com/ankitmaurya" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/ankitmaurya" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
