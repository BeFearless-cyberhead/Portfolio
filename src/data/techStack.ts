import type { TechItem } from '@/types/portfolio';

export const techStack: TechItem[] = [
  // Data & AI Track
  { name: 'Python',            icon: '🐍', track: 'data' },
  { name: 'LangGraph',         icon: '🔗', track: 'data' },
  { name: 'Jupyter',           icon: '📓', track: 'data' },
  { name: 'Pandas',            icon: '🐼', track: 'data' },
  { name: 'SQL',               icon: '🗄️', track: 'data' },
  { name: 'Supabase',          icon: '⚡', track: 'data' },
  { name: 'AI Tagging',        icon: '🏷️', track: 'data' },

  // AI Engineering Track
  { name: 'LangGraph',         icon: '🔗', track: 'ai' },
  { name: 'OpenAI API',        icon: '🤖', track: 'ai' },
  { name: 'LangChain',         icon: '⛓️', track: 'ai' },
  { name: 'Vector DBs',        icon: '📐', track: 'ai' },
  { name: 'Prompt Engineering', icon: '✍️', track: 'ai' },

  // Shared (always visible)
  { name: 'HTML5',       icon: '🌐', track: 'shared' },
  { name: 'CSS3',        icon: '🎨', track: 'shared' },
  { name: 'JavaScript',  icon: '⚙️', track: 'shared' },
  { name: 'React',       icon: '⚛️', track: 'shared' },
  { name: 'TypeScript',  icon: '🔷', track: 'shared' },
  { name: 'Git',         icon: '📦', track: 'shared' },
  { name: 'Vercel',      icon: '▲',  track: 'shared' },
];
