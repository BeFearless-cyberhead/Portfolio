import styles from './shared.module.css';

interface TagProps {
  label: string;
  className?: string;
}

export function Tag({ label, className = '' }: TagProps) {
  return (
    <span className={`${styles.tag} ${className}`}>
      {label}
    </span>
  );
}
