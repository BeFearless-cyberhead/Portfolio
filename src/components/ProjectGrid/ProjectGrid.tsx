'use client';

import { useEffect, useRef, useState } from 'react';
import { projects } from '@/data/projects';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import styles from './ProjectGrid.module.css';

function EmptyState() {
  return (
    <div className={styles.empty}>
      <p>Nothing hung on this lantern yet — more projects coming soon.</p>
      <a
        href="https://github.com/BeFearless-cyberhead"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn--ghost"
      >
        Browse GitHub instead
      </a>
    </div>
  );
}

export function ProjectGrid() {
  const [openProject, setOpenProject] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const selected = projects.find((p) => p.id === openProject) ?? null;

  useEffect(() => {
    const gallery = galleryRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!gallery || !stage || !track) return;

    const desktop = window.matchMedia('(min-width: 761px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let driven = false;
    let distance = 0;
    let stickyTop = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!driven) return;
      const progress = stickyTop - gallery.getBoundingClientRect().top;
      track.scrollLeft = Math.max(0, Math.min(distance, progress));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const measure = () => {
      stickyTop = parseFloat(window.getComputedStyle(stage).top) || 0;
      distance = Math.max(0, track.scrollWidth - track.clientWidth);
      // Pin only when the entire gallery fits; short screens retain native swiping.
      driven = desktop.matches && !reducedMotion.matches && distance > 0
        && stage.offsetHeight + stickyTop + 24 <= window.innerHeight;
      gallery.dataset.scrollDriven = String(driven);
      gallery.style.setProperty('--gallery-height', `${stage.offsetHeight + distance}px`);
      schedule();
    };

    const onFocus = (event: FocusEvent) => {
      const card = (event.target as HTMLElement).closest('article');
      if (!driven || !card) return;
      const bounds = card.getBoundingClientRect();
      const viewport = track.getBoundingClientRect();
      const visible = bounds.left >= viewport.left && bounds.right <= viewport.right;
      const progress = Math.max(0, Math.min(distance, stickyTop - gallery.getBoundingClientRect().top));
      if (visible && bounds.top >= stickyTop && bounds.bottom <= window.innerHeight
        && Math.abs(track.scrollLeft - progress) < 2) return;

      const start = window.scrollY + gallery.getBoundingClientRect().top - stickyTop;
      window.scrollTo({
        top: start + Math.min(distance, visible ? track.scrollLeft : card.offsetLeft),
        behavior: 'instant',
      });
      update();
    };

    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(track);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    desktop.addEventListener('change', measure);
    reducedMotion.addEventListener('change', measure);
    track.addEventListener('focusin', onFocus);
    measure();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      desktop.removeEventListener('change', measure);
      reducedMotion.removeEventListener('change', measure);
      track.removeEventListener('focusin', onFocus);
      delete gallery.dataset.scrollDriven;
      gallery.style.removeProperty('--gallery-height');
    };
  }, []);

  return (
    <section id="projects" className={`section ${styles.projects}`} aria-label="Featured projects">
      <div className={`section__inner ${styles.heading}`}>
        <p className="section__eyebrow">02 · Featured Projects</p>
        <h2 className="section__title">Work I&rsquo;ve lit a path through</h2>
        <p className="section__intro">
          Data, AI, and product experiments. Open a card for the full case study.
        </p>
      </div>

      <div ref={galleryRef} className={styles.gallery}>
        <div ref={stageRef} className={styles.stage}>
          <p id="projects-scroll-hint" className={styles.galleryHint}>
            <span className={styles.scrollHint}>Scroll down to explore →</span>
            <span className={styles.swipeHint}>Swipe or scroll sideways →</span>
            <span>{String(projects.length).padStart(2, '0')} projects</span>
          </p>
          <div
            ref={trackRef}
            className={styles.grid}
            role="region"
            aria-label="Project gallery"
            aria-describedby="projects-scroll-hint"
            tabIndex={0}
          >
            {projects.length === 0 && <EmptyState />}
            {projects.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                onOpen={() => setOpenProject(p.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setOpenProject(null)} />
    </section>
  );
}
