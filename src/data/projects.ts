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
    repoUrl: 'https://github.com/ankitkumar/financial-tracker',
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
    id: 'sales-dashboard',
    track: 'data',
    title: 'Real-Time Sales Analytics Dashboard',
    hook: 'Interactive analytics platform turning 50K+ daily sales records into actionable insights with automated anomaly detection and trend forecasting.',
    metrics: [
      { value: '50K+', label: 'daily records processed' },
      { value: '< 2s', label: 'query response time' },
      { value: '12', label: 'KPI visualisations' },
    ],
    tags: ['Python', 'Pandas', 'SQL', 'Supabase', 'React', 'D3.js'],
    thumbnail: '/assets/projects/sales-dashboard/thumb.webp',
    repoUrl: 'https://github.com/ankitkumar/sales-dashboard',
    modal: {
      description: `Designed and built a comprehensive sales analytics platform that processes over 50,000 daily transaction records from multiple retail channels. The dashboard provides real-time visibility into revenue trends, product performance, regional breakdowns, and customer segmentation metrics.

The data pipeline ingests raw sales data from POS systems, e-commerce platforms, and marketplace APIs. Each record passes through a cleaning and enrichment stage using Pandas, where it's normalised, deduplicated, and augmented with derived metrics like customer lifetime value and product affinity scores.

A key technical achievement was implementing a statistical anomaly detection system using z-score analysis and rolling averages. The system automatically flags unusual sales spikes or drops and generates alerts, catching data quality issues and genuine business events with an 89% precision rate.

The frontend features 12 interactive D3.js visualisations including heat maps, funnel charts, and time-series plots. All charts support drill-down filtering and date range comparisons, making it easy for non-technical stakeholders to explore data independently.`,
      architecture: '/assets/projects/sales-dashboard/arch.svg',
      codeSnippet: {
        lang: 'python',
        code: `import pandas as pd
import numpy as np

def detect_anomalies(df: pd.DataFrame, column: str, window: int = 30):
    """Flag anomalous values using rolling z-score."""
    rolling_mean = df[column].rolling(window).mean()
    rolling_std = df[column].rolling(window).std()
    z_scores = (df[column] - rolling_mean) / rolling_std
    df['is_anomaly'] = np.abs(z_scores) > 2.5
    df['z_score'] = z_scores
    return df

# Apply to daily revenue
daily_revenue = sales_df.groupby('date')['revenue'].sum().reset_index()
flagged = detect_anomalies(daily_revenue, 'revenue')
alerts = flagged[flagged['is_anomaly']]`,
        caption: 'Rolling z-score anomaly detection on daily revenue — flags spikes and drops automatically.',
      },
    },
  },
  {
    id: 'medi-mind',
    track: 'ai',
    title: 'Medi Mind',
    hook: 'Full-stack medical intake system built and deployed in 36 hours at a hackathon, with a custom registration backend and zero downtime during the live demo.',
    metrics: [
      { value: '36 hrs', label: 'build time' },
      { value: '200+', label: 'test users at event' },
      { value: '0', label: 'backend downtime' },
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'Supabase', 'Custom Auth'],
    thumbnail: '/assets/projects/medi-mind/thumb.webp',
    repoUrl: 'https://github.com/ankitkumar/medi-mind',
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
  {
    id: 'doc-retrieval-agent',
    track: 'ai',
    title: 'Intelligent Document Retrieval Agent',
    hook: 'Multi-agent RAG system that ingests, chunks, and retrieves documents with context-aware re-ranking — achieving 92% answer accuracy on internal knowledge bases.',
    metrics: [
      { value: '92%', label: 'answer accuracy' },
      { value: '1.2s', label: 'avg retrieval time' },
      { value: '10K+', label: 'documents indexed' },
    ],
    tags: ['LangGraph', 'OpenAI', 'Pinecone', 'Python', 'FastAPI'],
    thumbnail: '/assets/projects/doc-retrieval-agent/thumb.webp',
    repoUrl: 'https://github.com/ankitkumar/doc-retrieval-agent',
    modal: {
      description: `Built a production-grade Retrieval Augmented Generation (RAG) system using a multi-agent architecture orchestrated by LangGraph. The system handles document ingestion from PDFs, Word files, and web pages, automatically chunking content with semantic-aware splitting to preserve context boundaries.

The retrieval pipeline uses a two-stage approach: first, a fast vector similarity search using Pinecone to retrieve top-50 candidate chunks, followed by a cross-encoder re-ranking model that scores each chunk against the query for relevance. This hybrid approach improved answer accuracy from 74% (naive RAG) to 92%.

A key innovation was implementing a "query decomposition" agent that breaks complex multi-part questions into atomic sub-queries, retrieves separately for each, and then synthesises a unified answer. This handles questions like "Compare the Q3 and Q4 revenue targets and explain the variance" which would fail with a single-pass retrieval.

The system is deployed as a FastAPI service with streaming responses, serving an internal team of 30+ analysts who query a knowledge base of 10,000+ documents daily.`,
      architecture: '/assets/projects/doc-retrieval-agent/arch.svg',
      codeSnippet: {
        lang: 'python',
        code: `from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

class RAGState(TypedDict):
    query: str
    sub_queries: list[str]
    chunks: list[Document]
    ranked_chunks: list[Document]
    answer: str

def decompose_query(state: RAGState):
    """Break complex queries into atomic sub-queries."""
    llm = ChatOpenAI(model="gpt-4o-mini")
    sub_queries = llm.invoke(
        f"Break this into atomic sub-queries: {state['query']}"
    )
    return {**state, "sub_queries": sub_queries}

def retrieve_and_rerank(state: RAGState):
    """Vector search + cross-encoder re-ranking."""
    all_chunks = []
    for sq in state["sub_queries"]:
        hits = pinecone_index.query(embed(sq), top_k=50)
        all_chunks.extend(hits)
    ranked = cross_encoder.rerank(state["query"], all_chunks)
    return {**state, "ranked_chunks": ranked[:10]}`,
        caption: 'Multi-agent RAG pipeline with query decomposition and cross-encoder re-ranking.',
      },
    },
  },
];
