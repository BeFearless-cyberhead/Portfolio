// /src/types/portfolio.d.ts

export interface Metric {
  value: string;        // e.g. "95%", "36 hrs", "3K+"
  label: string;        // e.g. "categorisation accuracy"
}

export interface CodeBlock {
  lang: string;         // e.g. "python", "typescript", "cpp"
  code: string;         // raw code string
  caption?: string;     // optional explanation below snippet
}

export interface Project {
  id:         string;           // kebab-case, e.g. "source-lens"
  title:      string;
  hook:       string;           // 1-sentence value prop — card face
  metrics:    Metric[];         // 2–3 stat chips on card and modal
  tags:       string[];         // tech stack labels
  thumbnail:  string;           // /assets/projects/{id}/thumb.webp
  repoUrl?:   string;           // GitHub URL
  liveUrl?:   string;           // Deployed app URL (if any)
  caseStudy: {
    problem: string;
    approach: string;
    outcome: string;
    nextStep: string;
  };
  modal: {
    description:   string;      // Rich text — min 150 words
    architecture:  string;      // Path to SVG: /assets/projects/{id}/arch.svg
    codeSnippet?:  CodeBlock;
  };
}

export interface KaizenNode {
  id:          number;
  title:       string;
  dateRange:   string;         // e.g. "Oct 2024"
  role:        string;
  teamSize:    number;
  outcome:     string;         // measurable result
}

export interface PortfolioStat {
  key:    string;
  value:  string;
  label:  string;
}

export type Theme = 'light' | 'dark';
export type FormState = 'idle' | 'loading' | 'success' | 'error';
