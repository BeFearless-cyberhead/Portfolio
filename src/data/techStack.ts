import type { Track } from '@/types/portfolio';
import {
  SiPython, SiJupyter, SiPandas, SiSupabase,
  SiOpenai, SiLangchain,
  SiHtml5, SiCss3, SiJavascript, SiReact, SiTypescript, SiGit, SiVercel,
} from 'react-icons/si';
import { TbBrain, TbTag, TbVectorTriangle, TbMessageChatbot } from 'react-icons/tb';
import { HiOutlineCircleStack } from 'react-icons/hi2';
import type { IconType } from 'react-icons';

export interface TechItemWithIcon {
  name: string;
  icon: IconType;
  track: Track | 'shared';
  color: string; // brand color for the icon
}

export const techStack: TechItemWithIcon[] = [
  // Data & AI Track
  { name: 'Python',            icon: SiPython,            track: 'data',   color: '#3776AB' },
  { name: 'LangGraph',         icon: TbBrain,             track: 'data',   color: '#1C3C3C' },
  { name: 'Jupyter',           icon: SiJupyter,           track: 'data',   color: '#F37626' },
  { name: 'Pandas',            icon: SiPandas,            track: 'data',   color: '#150458' },
  { name: 'SQL',               icon: HiOutlineCircleStack,track: 'data',   color: '#4479A1' },
  { name: 'Supabase',          icon: SiSupabase,          track: 'data',   color: '#3FCF8E' },
  { name: 'AI Tagging',        icon: TbTag,               track: 'data',   color: '#C9A84C' },

  // AI Engineering Track
  { name: 'LangGraph',         icon: TbBrain,             track: 'ai',     color: '#1C3C3C' },
  { name: 'OpenAI API',        icon: SiOpenai,            track: 'ai',     color: '#412991' },
  { name: 'LangChain',         icon: SiLangchain,         track: 'ai',     color: '#1C3C3C' },
  { name: 'Vector DBs',        icon: TbVectorTriangle,    track: 'ai',     color: '#6366F1' },
  { name: 'Prompt Engineering', icon: TbMessageChatbot,   track: 'ai',     color: '#0E7C7B' },

  // Shared (always visible)
  { name: 'HTML5',       icon: SiHtml5,       track: 'shared', color: '#E34F26' },
  { name: 'CSS3',        icon: SiCss3,        track: 'shared', color: '#1572B6' },
  { name: 'JavaScript',  icon: SiJavascript,  track: 'shared', color: '#F7DF1E' },
  { name: 'React',       icon: SiReact,       track: 'shared', color: '#61DAFB' },
  { name: 'TypeScript',  icon: SiTypescript,   track: 'shared', color: '#3178C6' },
  { name: 'Git',         icon: SiGit,          track: 'shared', color: '#F05032' },
  { name: 'Vercel',      icon: SiVercel,       track: 'shared', color: '#000000' },
];
