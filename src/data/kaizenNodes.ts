import type { KaizenNode } from '@/types/portfolio';

export const kaizenNodes: KaizenNode[] = [
  {
    id: 1,
    title: 'Team Formation & Scoping',
    dateRange: 'Oct 2024',
    role: 'Lead — defined scope, assigned roles',
    teamSize: 5,
    outcome: 'Project brief signed off in under 2 hours',
  },
  {
    id: 2,
    title: 'Technical Architecture Sprint',
    dateRange: 'Oct 2024',
    role: 'Architect — designed system, resolved blockers',
    teamSize: 5,
    outcome: 'Full stack agreed, repos created',
  },
  {
    id: 3,
    title: 'Rapid Development',
    dateRange: 'Oct 2024',
    role: 'Full-stack dev + coordinator',
    teamSize: 5,
    outcome: 'MVP feature-complete at T-6 hours',
  },
  {
    id: 4,
    title: 'Deployment & QA',
    dateRange: 'Oct 2024',
    role: 'DevOps lead — Vercel deploy + QA pass',
    teamSize: 5,
    outcome: 'Live URL delivered 2 hrs before deadline',
  },
  {
    id: 5,
    title: 'Presentation & Result',
    dateRange: 'Oct 2024',
    role: 'Presenter',
    teamSize: 5,
    outcome: 'Top 3 finish among 20+ teams',
  },
];
