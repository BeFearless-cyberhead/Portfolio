'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import '@designcodeio/threeui/style.css';
import styles from './TempleBackground.module.css';

/**
 * TempleNightScene is WebGL-only and browser-only:
 * it must be dynamically imported with ssr:false, and this file
 * is a Client Component so that contract is satisfied
 * (per Next.js docs: ssr:false is not allowed in Server Components).
 */
const TempleNightScene = dynamic(
  () =>
    import('@designcodeio/threeui/components/TempleNightScene').then(
      (m) => m.TempleNightScene,
    ),
  { ssr: false, loading: () => null },
);

/**
 * Fixed, full-page living background. The scene fills the viewport,
 * all page sections scroll above it. The vignette overlay keeps text
 * legible over the lantern light and moon.
 *
 * Scroll behavior: the temple renders at full strength on the landing
 * view; as the reader scrolls into the content sections, the scene
 * fades back and a scrim settles over it — the temple stays visible
 * as atmosphere, but the page text always reads on top of it.
 * The fade is driven by a --temple-dim custom property (0 → 1) set
 * from a passive scroll listener (see the dim effect below).

 * The scene component handles everything internally:
 * - pauses rendering when offscreen / tab hidden / window blurred
 * - renders a single frame and stops when prefers-reduced-motion is set
 * - falls back to an inline message when WebGL is unavailable
 */
export function TempleBackground() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  // Scroll fade — temple is fully vivid on the landing view, then dims
  // to translucent atmosphere as the reader scrolls into the content.
  // Updates a --temple-dim custom property (0 → 1) on the stage; the
  // CSS layers consume it, so per-frame writes stay cheap.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      // Begin fading just after the hero starts leaving the viewport
      // and finish by about one viewport height of scroll.
      const start = vh * 0.2;
      const end = vh * 1.1;
      const t = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
      stage.style.setProperty('--temple-dim', t.toFixed(3));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Pointer bridge — the scene listens for pointermove on its own canvas,
  // but page content sits above a fixed background layer, so the raw
  // events never reach it. Forward cursor position from the window so
  // the temple's pointer wisps still follow the cursor across sections.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    let detach: (() => void) | undefined;

    const attach = (canvas: HTMLCanvasElement) => {
      const forwardMove = (e: PointerEvent) => {
        canvas.dispatchEvent(
          new PointerEvent('pointermove', {
            clientX: e.clientX,
            clientY: e.clientY,
            pointerType: e.pointerType,
            bubbles: false,
          }),
        );
      };
      const forwardLeave = () => {
        canvas.dispatchEvent(
          new PointerEvent('pointerleave', { bubbles: false }),
        );
      };

      window.addEventListener('pointermove', forwardMove, { passive: true });
      document.addEventListener('pointerleave', forwardLeave);
      return () => {
        window.removeEventListener('pointermove', forwardMove);
        document.removeEventListener('pointerleave', forwardLeave);
      };
    };

    // The canvas mounts after the dynamic import resolves — retry briefly
    const interval = setInterval(() => {
      const canvas = scene.querySelector('canvas');
      if (canvas) {
        clearInterval(interval);
        detach = attach(canvas);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      detach?.();
    };
  }, []);

  return (
    <div className={styles.stage} aria-hidden="true" ref={stageRef}>
      <div className={styles.scene} ref={sceneRef}>
        <TempleNightScene />
      </div>
      {/* Scroll scrim — settles over the temple as the page scrolls,
          keeping the scene visible but clearly behind the text */}
      <div className={styles.scrim} />
      {/* Legibility overlays — never intercept input */}
      <div className={styles.vignette} />
      <div className={styles.rise} />
    </div>
  );
}
