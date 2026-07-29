import styles from './shared.module.css';

interface MetricChipProps {
  value: string;
  label: string;
  className?: string;
}

export function MetricChip({ value, label, className = '' }: MetricChipProps) {
  return (
    <div className={`${styles.metricChip} ${className}`}>
      <span className={styles.metricValue}>{value}</span>
      <span className={styles.metricLabel}>{label}</span>
    </div>
  );
}
