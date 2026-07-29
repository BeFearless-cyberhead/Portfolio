'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from './shared.module.css';

export interface ToastData {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div
      className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}
      role="alert"
      aria-live="polite"
    >
      <span className={styles.toastIcon}>
        {toast.type === 'success' ? '✓' : '✕'}
      </span>
      <p>{toast.message}</p>
      <button
        className={styles.toastClose}
        onClick={() => onClose(toast.id)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

// Global toast state
let toastListeners: ((toasts: ToastData[]) => void)[] = [];
let currentToasts: ToastData[] = [];

export function showToast(type: 'success' | 'error', message: string) {
  const newToast: ToastData = {
    id: Date.now().toString(),
    type,
    message,
  };
  currentToasts = [...currentToasts, newToast];
  toastListeners.forEach(fn => fn(currentToasts));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter(fn => fn !== setToasts);
    };
  }, []);

  const handleClose = useCallback((id: string) => {
    currentToasts = currentToasts.filter(t => t.id !== id);
    toastListeners.forEach(fn => fn(currentToasts));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={handleClose} />
      ))}
    </div>
  );
}
