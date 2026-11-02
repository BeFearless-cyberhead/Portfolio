import {
  SiPython, SiJupyter, SiPandas, SiSupabase,
  SiLangchain,
  SiJavascript, SiReact, SiTypescript, SiGit, SiVercel,
} from 'react-icons/si';
import { TbBrain, TbTag, TbVectorTriangle, TbMessageChatbot, TbBrandOpenai } from 'react-icons/tb';
import { HiOutlineCircleStack } from 'react-icons/hi2';
import type { IconType } from 'react-icons';

export interface TechItemWithIcon {
  name: string;
  icon: IconType;
  color: string; // brand color for the icon
}

export const techStack: TechItemWithIcon[] = [
  { name: 'Python',             icon: SiPython,             color: '#3776AB' },
  { name: 'Jupyter',            icon: SiJupyter,            color: '#F37626' },
  { name: 'Pandas',             icon: SiPandas,             color: '#150458' },
  { name: 'SQL',                icon: HiOutlineCircleStack, color: '#4479A1' },
  { name: 'LangGraph',          icon: TbBrain,              color: '#1C3C3C' },
  { name: 'LangChain',          icon: SiLangchain,          color: '#1C3C3C' },
  { name: 'OpenAI API',         icon: TbBrandOpenai,        color: '#412991' },
  { name: 'Vector Search',      icon: TbVectorTriangle,     color: '#6366F1' },
  { name: 'Prompt Engineering', icon: TbMessageChatbot,     color: '#0E7C7B' },
  { name: 'Supabase',           icon: SiSupabase,           color: '#3FCF8E' },
  { name: 'AI Tagging',         icon: TbTag,                color: '#C9A84C' },
  { name: 'JavaScript',         icon: SiJavascript,         color: '#F7DF1E' },
  { name: 'React',              icon: SiReact,              color: '#61DAFB' },
  { name: 'TypeScript',         icon: SiTypescript,         color: '#3178C6' },
  { name: 'Git',                icon: SiGit,                color: '#F05032' },
  { name: 'Vercel',             icon: SiVercel,             color: '#000000' },
];
