'use client';

import { useState } from 'react';
import type { FormState } from '@/types/portfolio';
import { showToast } from '@/components/shared/Toast';
import { supabase } from '@/lib/supabase';
import { NeuButton } from '@/components/shared/NeuButton';
import styles from './ContactSection.module.css';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '', // Spam prevention
  });

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.name.length < 2 || formData.name.length > 60) {
      newErrors.name = 'Please enter your full name (2–60 characters)';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters and spaces';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email) || formData.email.length > 254) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.message.length < 10 || formData.message.length > 2000) {
      newErrors.message = 'Message must be between 10 and 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check — bots fill hidden fields
    if (formData.honeypot) return;

    if (!validate()) return;

    setFormState('loading');

    try {
      if (supabase) {
        const { error } = await supabase
          .from('contact_submissions')
          .insert({
            name: formData.name,
            email: formData.email,
            message: formData.message,
          });

        if (error) throw error;
      } else {
        // Simulate submission when Supabase is not configured
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setFormState('success');
      showToast('success', 'Message sent! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '', honeypot: '' });
    } catch {
      setFormState('error');
      showToast('error', 'Something went wrong. Please try again or email me directly.');
    }

    setTimeout(() => setFormState('idle'), 3000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
      noValidate
      aria-busy={formState === 'loading'}
    >
      {/* Honeypot — hidden from users, visible to bots */}
      <input
        type="text"
        name="website"
        value={formData.honeypot}
        onChange={e => setFormData(prev => ({ ...prev, honeypot: e.target.value }))}
        className={styles.honeypot}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className={styles.field}>
        <label htmlFor="contact-name" className={styles.label}>Name</label>
        <input
          id="contact-name"
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          placeholder="Your full name"
          required
          minLength={2}
          maxLength={60}
          disabled={formState === 'loading'}
        />
        {errors.name && <span className={styles.error} role="alert">{errors.name}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email" className={styles.label}>Email</label>
        <input
          id="contact-email"
          type="email"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          placeholder="you@example.com"
          required
          maxLength={254}
          disabled={formState === 'loading'}
        />
        {errors.email && <span className={styles.error} role="alert">{errors.email}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message" className={styles.label}>Message</label>
        <textarea
          id="contact-message"
          value={formData.message}
          onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
          placeholder="Tell me about your project or opportunity..."
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          disabled={formState === 'loading'}
        />
        <div className={styles.charCount}>
          {formData.message.length}/2000
        </div>
        {errors.message && <span className={styles.error} role="alert">{errors.message}</span>}
      </div>

      <NeuButton
        type="submit"
        variant="raised"
        size="lg"
        disabled={formState === 'loading'}
      >
        {formState === 'loading' ? 'Sending...' : 'Send Message'}
      </NeuButton>
    </form>
  );
}
