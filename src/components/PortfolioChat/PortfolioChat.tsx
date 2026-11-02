'use client';

import { useEffect, useRef, useState } from 'react';
import { chatPrompts, chatWelcome, getPreviewReply } from '@/lib/portfolioChat';
import type { ChatReply } from '@/lib/portfolioChat';
import styles from './PortfolioChat.module.css';

interface Message extends ChatReply {
  role: 'assistant' | 'user';
}

const welcomeMessage: Message = { role: 'assistant', ...chatWelcome };

export function PortfolioChat() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [question, setQuestion] = useState('');
  const conversationRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (conversation) conversation.scrollTop = conversation.scrollHeight;
  }, [messages]);

  function sendMessage(value: string) {
    const content = value.trim();
    if (!content) return;

    setMessages((previous) => [
      ...previous,
      { role: 'user', content },
      { role: 'assistant', ...getPreviewReply(content) },
    ]);
    setQuestion('');
    inputRef.current?.focus();
  }

  function resetChat() {
    setMessages([welcomeMessage]);
    setQuestion('');
    inputRef.current?.focus();
  }

  return (
    <aside className={styles.panel} aria-labelledby="chat-title">
      <header className={styles.header}>
        <div className={styles.identity}>
          <span className={styles.lantern} aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5h8M16 2v3M12 27h8M16 27v3" strokeLinecap="round" />
              <rect x="7" y="7" width="18" height="18" rx="7" />
              <path d="M13 8c-3 5-3 11 0 16M19 8c3 5 3 11 0 16M8 13h16M8 19h16" />
            </svg>
          </span>
          <div>
            <p className={styles.eyebrow}>Your AI companion</p>
            <h3 id="chat-title">Lantern</h3>
          </div>
        </div>
        <button type="button" className={styles.reset} onClick={resetChat} aria-label="Clear chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 10a8 8 0 1 1 1.5 7M4 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      <p className={styles.preview}>
        <span aria-hidden="true" /> Preview · Custom knowledge coming later
      </p>

      <div
        ref={conversationRef}
        className={styles.conversation}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Conversation with Lantern"
        tabIndex={0}
      >
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
          >
            <span className={styles.author}>{message.role === 'user' ? 'You' : 'Lantern'}</span>
            <p>{message.content}</p>
            {message.links && (
              <div className={styles.messageLinks}>
                {message.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith('https:') ? '_blank' : undefined}
                    rel={link.href.startsWith('https:') ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.prompts} aria-label="Suggested questions">
        {chatPrompts.map((prompt) => (
          <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>
            {prompt} <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>

      <form
        className={styles.composer}
        aria-label="Chat with Lantern"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage(question);
        }}
      >
        <input
          ref={inputRef}
          id="chat-question"
          name="question"
          aria-label="Your question for Lantern"
          aria-describedby="chat-disclaimer"
          placeholder="Ask about my work…"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={500}
          autoComplete="off"
        />
        <button type="submit" disabled={!question.trim()} aria-label="Send question">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="m5 12 7-7 7 7M12 5v15" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
      <p id="chat-disclaimer" className={styles.disclaimer}>
        Curated demo replies for now. Data-backed AI will be connected next.
      </p>
    </aside>
  );
}
