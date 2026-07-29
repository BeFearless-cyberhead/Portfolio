import { Navigation } from '@/components/Navigation/Navigation';
import { HeroSection } from '@/components/HeroSection/HeroSection';
import { TrackSwitcher } from '@/components/TrackSwitcher/TrackSwitcher';
import { TechStack } from '@/components/TechStack/TechStack';
import { ProjectGrid } from '@/components/ProjectGrid/ProjectGrid';
import { KaizenTimeline } from '@/components/KaizenTimeline/KaizenTimeline';
import { VideoHub } from '@/components/VideoHub/VideoHub';
import { ContactSection } from '@/components/ContactSection/ContactSection';

export default function Home() {
  return (
    <>
      <Navigation />
      <HeroSection />
      <TrackSwitcher />
      <TechStack />
      <ProjectGrid />
      <KaizenTimeline />
      <VideoHub />
      <ContactSection />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: 'var(--space-8) var(--space-6)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-body-sm)',
        color: 'var(--color-text-secondary)',
        borderTop: '1px solid var(--color-border-default)',
      }}>
        <p>
          © {new Date().getFullYear()} Ankit Kumar · Built with Next.js, TypeScript & Supabase
        </p>
      </footer>
    </>
  );
}
