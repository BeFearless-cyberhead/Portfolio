import type { Project } from '@/types/portfolio';

export const projects: Project[] = [
  {
    id: 'financial-tracker',
    track: 'data',
    title: 'Personal Financial AI Tracker',
    hook: 'Automated extraction and real-time categorisation of expenses across email, SMS, and bank statements using a custom AI tagging engine.',
    metrics: [
      { value: '3 hrs/week', label: 'logging eliminated' },
      { value: '95%', label: 'categorisation accuracy' },
      { value: '6', label: 'financial accounts unified' },
    ],
    tags: ['Python', 'LangGraph', 'Supabase', 'AI Tagging', 'Pandas'],
    thumbnail: '/assets/projects/financial-tracker/thumb.webp',
    repoUrl: 'https://github.com/username/financial-tracker',
    modal: {
      description: `Built a comprehensive personal finance tracking system that automatically ingests transaction data from multiple sources — email receipts, SMS notifications, and direct bank statement imports. The core challenge was building a reliable AI categorisation engine that could handle the inconsistent formatting across different financial institutions and notification types.

The system uses a LangGraph-orchestrated pipeline where each transaction flows through a multi-step parsing process: raw text extraction, entity recognition (merchant, amount, date), and finally AI-powered category assignment. The categorisation model was trained on my own historical spending data and achieves 95% accuracy across 15 expense categories.

One specific technical challenge was handling duplicate detection across sources — the same purchase might appear as an email receipt, an SMS alert, and a bank statement line item. Implemented a fuzzy matching algorithm using amount, date proximity, and merchant name similarity to deduplicate with less than 1% false positive rate.

The dashboard provides real-time spending insights, trend analysis, and budget alerts, all powered by Supabase real-time subscriptions.`,
      architecture: '/assets/projects/financial-tracker/arch.svg',
      codeSnippet: {
        lang: 'python',
        code: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class TransactionState(TypedDict):
    raw_text: str
    merchant: str
    amount: float
    category: str

def parse_transaction(state: TransactionState):
    # Extract merchant and amount from raw text
    parsed = nlp_parser.extract(state["raw_text"])
    return {**state, **parsed}

def categorize(state: TransactionState):
    # AI-powered category assignment
    category = tagger.predict(
        merchant=state["merchant"],
        amount=state["amount"]
    )
    return {**state, "category": category}

graph = StateGraph(TransactionState)
graph.add_node("parse", parse_transaction)
graph.add_node("categorize", categorize)
graph.add_edge("parse", "categorize")
graph.add_edge("categorize", END)`,
        caption: 'LangGraph pipeline node for transaction parsing and AI-powered categorisation.',
      },
    },
  },
  {
    id: 'medi-mind',
    track: 'data',
    title: 'Medi Mind',
    hook: 'Full-stack medical intake system built and deployed in 36 hours at a hackathon, with a custom registration backend and zero downtime during the live demo.',
    metrics: [
      { value: '36 hrs', label: 'build time' },
      { value: '200+', label: 'test users at event' },
      { value: '0', label: 'backend downtime' },
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'Supabase', 'Custom Auth'],
    thumbnail: '/assets/projects/medi-mind/thumb.webp',
    repoUrl: 'https://github.com/username/medi-mind',
    modal: {
      description: `Developed during a 36-hour hackathon, Medi Mind is a full-stack medical intake and registration system designed to streamline patient onboarding at healthcare facilities. The project was born from observing the inefficiency of paper-based registration forms at a local clinic.

As the technical architect and lead developer on a team of five, I made the critical decision to use Supabase as our backend to maximise development velocity. This allowed us to have a working authentication system, database, and row-level security policies within the first 4 hours.

The system features a multi-step registration form with progressive disclosure, real-time form validation, and a custom authentication layer that ensures HIPAA-aware data isolation — each participant can only view and edit their own medical records through Supabase RLS policies.

The most challenging aspect was building the admin dashboard that allows healthcare staff to view aggregated, anonymised intake data while maintaining individual privacy. We solved this with Supabase database functions that return computed statistics without exposing individual records.

During the live demo, the system handled 200+ concurrent test users with zero backend downtime, which contributed to our strong placement in the competition.`,
      architecture: '/assets/projects/medi-mind/arch.svg',
      codeSnippet: {
        lang: 'typescript',
        code: `// Supabase RLS policy for patient data isolation
const { data, error } = await supabase
  .from('patient_records')
  .insert({
    patient_id: user.id,
    name: formData.name,
    intake_data: formData.medicalHistory,
    created_at: new Date().toISOString()
  });

// RLS Policy (SQL):
// CREATE POLICY "patients_own_data" ON patient_records
//   FOR ALL USING (auth.uid() = patient_id);`,
        caption: 'Row-level security ensures each participant sees only their own data.',
      },
    },
  },
];
