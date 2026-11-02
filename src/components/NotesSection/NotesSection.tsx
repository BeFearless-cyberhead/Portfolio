import styles from './NotesSection.module.css';

const notes = [
  {
    label: 'Evaluation',
    title: 'Accuracy is only the first question',
    summary:
      'A practical way to pair model performance with calibration, leakage checks, and the cost of a wrong prediction.',
  },
  {
    label: 'RAG systems',
    title: 'No source, no answer',
    summary:
      'Designing retrieval pipelines around evidence, citations, and failure states instead of confident-looking output.',
  },
  {
    label: 'Learning log',
    title: 'From notebook to something usable',
    summary:
      'The small engineering decisions that make an experiment easier to test, explain, deploy, and improve.',
  },
];

export function NotesSection() {
  return (
    <section id="notes" className="section" aria-label="Notes and experiments">
      <div className="section__inner">
        <p className="section__eyebrow">03 · Lantern Notes</p>
        <h2 className="section__title">Questions I&rsquo;m carrying</h2>
        <p className="section__intro">
          Short reflections from the work: the trade-offs, checks, and lessons that
          sit behind the finished demos.
        </p>

        <div className={styles.grid}>
          {notes.map((note, index) => (
            <article key={note.title} className={styles.card}>
              <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
              <p className={styles.label}>{note.label}</p>
              <h3>{note.title}</h3>
              <p className={styles.summary}>{note.summary}</p>
              <span className={styles.status}>Writing this path next <span aria-hidden="true">→</span></span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
