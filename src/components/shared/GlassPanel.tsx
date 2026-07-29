import styles from './shared.module.css';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return (
    <div className={`${styles.glassPanel} ${className}`}>
      {children}
    </div>
  );
}
