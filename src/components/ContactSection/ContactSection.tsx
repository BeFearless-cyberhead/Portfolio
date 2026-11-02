'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { FormState } from '@/types/portfolio';
import { PortfolioChat } from '@/components/PortfolioChat/PortfolioChat';
import styles from './ContactSection.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

function Toast({ state }: { state: FormState }) {
  if (state !== 'success' && state !== 'error') return null;
  const isError = state === 'error';
  return (
    <p
      role="status"
      aria-live="polite"
      className={`${styles.toast} ${isError ? styles.toastError : styles.toastSuccess}`}
    >
      {isError
        ? 'The form is unavailable right now. Please reach me through LinkedIn or GitHub below.'
        : 'Message received — I will reply soon.'}
    </p>
  );
}

export function ContactSection() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Errors>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    // Client-side validation per the PRD contract
    const next: Errors = {};
    if (name.length < 2 || name.length > 60 || !/^[a-zA-Z\s'-]+$/.test(name)) {
      next.name = 'Please enter your full name (2–60 characters).';
    }
    if (!EMAIL_RE.test(email) || email.length > 254) {
      next.email = 'Please enter a valid email address.';
    }
    if (message.length < 10 || message.length > 2000) {
      next.message = 'Message must be between 10 and 2000 characters.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!supabase) {
      setFormState('error');
      return;
    }

    setFormState('loading');
    const { error } = await supabase.from('contact_submissions').insert([
      { name, email, message },
    ]);

    if (error) {
      setFormState('error');
      return;
    }

    setFormState('success');
    form.reset();
  }

  const busy = formState === 'loading';

  // Auto-dismiss the toast after a beat (success clears to idle)
  useEffect(() => {
    if (formState !== 'success' && formState !== 'error') return;
    const t = setTimeout(() => setFormState('idle'), 6000);
    return () => clearTimeout(t);
  }, [formState]);

  return (
    <section id="contact" className="section" aria-label="Contact">
      <div className="section__inner">
        <p className="section__eyebrow">05 · Contact</p>
        <h2 className="section__title">Leave a light on</h2>
        <p className="section__intro">
          Whether it&rsquo;s a role, a project, or a hard problem — the door is open.
        </p>

        <div className={styles.layout}>
          <form className={styles.form} onSubmit={handleSubmit} aria-label="Send a message" noValidate>
            <header className={styles.panelIntro}>
              <p className={styles.panelLabel}>A human connection</p>
              <h3>Send a note</h3>
              <p>For opportunities, collaborations, or a good conversation.</p>
            </header>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={60}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p id="contact-name-error" className={styles.fieldError}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <p id="contact-email-error" className={styles.fieldError}>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                required
                minLength={10}
                maxLength={2000}
                rows={4}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                placeholder="What are you building?"
              />
              {errors.message && (
                <p id="contact-message-error" className={styles.fieldError}>
                  {errors.message}
                </p>
              )}
            </div>

            <div className={styles.actions}>
              <button type="submit" className="btn btn--primary" disabled={busy} aria-busy={busy}>
                {busy ? 'Sending…' : 'Send message'}
              </button>
              <Toast state={formState} />
            </div>
            <div className={styles.directLinks} aria-label="Direct contact links">
              <a href="https://linkedin.com/in/ankit-maurya-2123ab307" target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
              <a href="https://github.com/BeFearless-cyberhead" target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            </div>
          </form>
          <PortfolioChat />
        </div>
      </div>
    </section>
  );
}

