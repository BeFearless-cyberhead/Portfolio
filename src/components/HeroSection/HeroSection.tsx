'use client';

import { motion } from 'framer-motion';
import { TypewriterEffect } from './TypewriterEffect';
import { StatChips } from './StatChips';
import { NeuButton } from '@/components/shared/NeuButton';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const handleExplore = () => {
    document.getElementById('track')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className={styles.hero} aria-label="Hero introduction">
      {/* Background image with overlay */}
      <div className={styles.heroBg}>
        <div className={styles.heroOverlay} />
      </div>

      <div className={styles.heroContent}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className={styles.heroText}
        >
          <h1 className={styles.heroName}>
            Ankit Kumar
          </h1>

          <div className={styles.heroSubheadline}>
            <TypewriterEffect
              strings={['AI Systems Engineer', 'Data Analytics Lead', 'LangGraph Architect']}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <StatChips />
          </motion.div>

          <motion.div
            className={styles.heroCtas}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <NeuButton
              variant="raised"
              size="lg"
              glowing
              onClick={handleExplore}
            >
              Explore Architectures
            </NeuButton>

            <NeuButton
              variant="ghost"
              size="lg"
              onClick={() => window.open('/resume.pdf', '_blank')}
            >
              Download Resume
            </NeuButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <span>↓</span>
      </motion.div>
    </section>
  );
}
