'use client';

import { ButtonHTMLAttributes } from 'react';
import styles from './shared.module.css';

interface NeuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'raised' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glowing?: boolean;
}

export function NeuButton({
  variant = 'raised',
  size = 'md',
  glowing = false,
  className = '',
  children,
  ...props
}: NeuButtonProps) {
  return (
    <button
      className={`${styles.neuButton} ${styles[`btn-${variant}`]} ${styles[`btn-${size}`]} ${glowing ? styles.btnGlow : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
