import type { Project } from '@/types/portfolio';

export const projects: Project[] = [
  {
    id: 'source-lens',
    track: 'ai',
    title: 'SourceLens',
    hook: 'Domain-specific RAG chatbot that grounds every answer in an internal corpus — ingestion, retrieval, re-ranking, and citations end to end.',
    metrics: [
      { value: '100%', label: 'answers carry citations' },
      { value: '< 2s', label: 'target retrieval latency' },
      { value: '4', label: 'source types ingested' },
    ],
    tags: ['Python', 'LangGraph', 'RAG', 'Vector Search', 'FastAPI'],
    thumbnail: '/assets/projects/source-lens/thumb.webp',
    modal: {
      description: `SourceLens is a domain-specific RAG chatbot built around one hard rule: no source, no answer. The system was designed for settings where generic LLM knowledge is not enough — internal documentation, engineering wikis, support tickets, and structured exports where the model must argue from your corpus, not from memory.

The ingestion pipeline handles heterogeneous sources (PDFs, Markdown wikis, ticket exports, web pages) and chunks them semantically so that context survives fragmentation. Each chunk is embedded and indexed for fast vector recall, with the domain vocabulary kept intact rather than flattened by generic preprocessing.

At query time, a decomposer agent splits complex questions into atomic sub-queries — "compare X and Y" becomes separate retrievals that get individually grounded — then a cross-encoder re-ranks the recalled chunks before answer synthesis. A groundedness check stands between the generator and the user: any sentence the corpus cannot support is discarded, and every claim ships with its citation.

The chat interface streams responses with inline source chips, so a reader can collapse any sentence back to the paragraph that produced it.`,
      architecture: '/assets/projects/source-lens/arch.svg',
      codeSnippet: {
        lang: 'python',
        code: `from langgraph.graph import StateGraph, END

class RAGState(TypedDict):
    query: str
    sub_queries: list[str]
    chunks: list[Document]
    ranked: list[Document]
    answer: str

def decompose(state: RAGState):
    """Split a compound question into atomic sub-queries."""
    state["sub_queries"] = split_atomic(state["query"])
    return state

def retrieve_and_rerank(state: RAGState):
    pool = [index.search(q, top_k=50) for q in state["sub_queries"]]
    state["ranked"] = cross_encoder.rerank(state["query"],
                                           flatten(pool))[:10]
    return state

graph.add_node("decompose", decompose)
graph.add_node("rerank", retrieve_and_rerank)`,
        caption: 'Query decomposition feeds parallel retrieval; the cross-encoder re-ranks before synthesis.',
      },
    },
  },
  {
    id: 'policy-forge',
    track: 'ai',
    title: 'PolicyForge',
    hook: 'Deterministic, least-privilege AWS IAM policy generation from structured access intent — exact actions, scoped ARNs, zero wildcards.',
    metrics: [
      { value: '0', label: 'wildcards in output' },
      { value: '100%', label: 'deterministic render' },
      { value: 'Fail', label: 'safe on unknown intent' },
    ],
    tags: ['Python', 'AWS IAM', 'Policy as Code', 'Pydantic', 'boto3'],
    thumbnail: '/assets/projects/policy-forge/thumb.webp',
    modal: {
      description: `PolicyForge turns a structured access intent — service, actions, resources — into a least-privilege AWS IAM policy, deterministically. The target problem is familiar to anyone who has reviewed an IAM policy littered with "s3:*" on "arn:aws:s3:::*": cloud roles almost always over-grant, because writing precise policies by hand is punishing and LLM-generated policies are non-reproducible.

PolicyForge rejects both failure modes. The input is not prose: the caller declares the access they need as a validated structure (schema-checked, enums enforced, unknown fields refused — there is no request for the system to "interpret"). A rules engine then narrows the request against per-service knowledge — what actions exist for the service, which ARN patterns they legitimately take, and how a model name, bucket, or namespace scope-down should look.

Because every step is a pure function of the input, the same intent always renders the same canonical policy JSON: sorted keys, exact action strings, resources shrunk to the narrowest ARN that satisfies the declared use. Nothing is invented; unknown combinations fail loudly instead of producing a hopeful guess.

Output policies run through an IAM policy simulator in CI, asserting both what is allowed and — critically — what is still denied.`,
      architecture: '/assets/projects/policy-forge/arch.svg',
      codeSnippet: {
        lang: 'python',
        code: `intent = AccessIntent(
    service="s3",
    actions=["GetObject", "ListBucket"],
    resources=["etl-raw-eu", "etl-clean-eu"],
)

policy = forge(intent)

# {
#   "Effect": "Allow",
#   "Action":  ["s3:GetObject", "s3:ListBucket"],
#   "Resource": ["arn:aws:s3:::etl-raw-eu/*",
#                "arn:aws:s3:::etl-clean-eu/*"]
# }
# Same intent -> byte-for-byte same policy. No "*" survives.`,
        caption: 'Structured intent in, canonical least-privilege policy out — reproducible and identity-free.',
      },
    },
  },
  {
    id: 'spam-detector',
    track: 'data',
    title: 'SMS Spam Detector',
    hook: 'End-to-end spam classification engine: calibrated NLP model packaged as a real Python library, served four ways and shipped with 176 passing tests.',
    metrics: [
      { value: '98.8%', label: 'held-out accuracy' },
      { value: '176', label: 'tests · 96% coverage' },
      { value: '0.0099', label: 'Brier score (calibrated)' },
    ],
    tags: ['Python', 'scikit-learn', 'FastAPI', 'Streamlit', 'Docker', 'CI'],
    thumbnail: '/assets/projects/spam-detector/thumb.webp',
    repoUrl: 'https://github.com/BeFearless-cyberhead/Spam_detector',
    modal: {
      description: `An end-to-end spam-classification project built like production software rather than a notebook saga: a scikit-learn NLP pipeline packaged as a proper Python library (src/ layout, pyproject.toml, five console entry points), a training/evaluation CLI, an interactive Streamlit demo, and a containerised FastAPI service — all covered by tests and GitHub Actions CI.

The model is TF-IDF (word + character n-grams, 30k features) feeding a class-balanced logistic-regression classifier, chosen deliberately: on SMS-length text it reaches ~99% accuracy in seconds on CPU, its coefficients are inspectable, and the whole calibrated artifact stays under 4 MB. Probabilities are wrapped in sigmoid calibration so the confidence numbers shown in the UI and API are honest — Brier score 0.0099, log-loss 0.0386.

Data hygiene is where this project refuses the classic shortcuts: duplicates are dropped, contradictory labels abort training instead of being silently resolved, and no message appears in both train and test splits — so the reported 98.8% accuracy on a 1,032-message stratified hold-out is not leakage dressing. Spam F1 is 0.953 with recall deliberately weighted up via class balancing, because missed spam is the metric that matters in a filtering product.

Every prediction can explain itself — coefficient-based top tokens surface in the CLI (--explain), the API, and the UI. The service also ships operational muscle: batch prediction, a /feedback misclassification log, drift monitoring on message length and out-of-vocabulary rate, lazy model loading so /health stays honest, structured error contracts, Docker + docker-compose, and a Render Blueprint that deploys both services.`,
      architecture: '/assets/projects/spam-detector/arch.svg',
      codeSnippet: {
        lang: 'bash',
        code: `$ curl -X POST http://127.0.0.1:8000/predict \\
    -H "Content-Type: application/json" \\
    -d '{"message": "Congratulations! You won a free prize!",
         "explain": true}'

{
  "label": "spam",
  "is_spam": true,
  "spam_probability": 0.953,
  "explanations": [
    {"token": "prize", "direction": "spam", "weight": 1.204}
  ]
}`,
        caption: 'The REST contract: calibrated probability plus token-level explanation for every verdict.',
      },
    },
  },
  {
    id: 'skillify',
    track: 'data',
    title: 'Skillify',
    hook: 'Full-stack community platform where members share skills, request learning sessions, borrow resources, and earn Skill Coins — on Firebase Auth + a Flask REST API.',
    metrics: [
      { value: '7', label: 'integrated modules' },
      { value: '2', label: 'deployed platforms' },
      { value: '1', label: 'shared coin ledger' },
    ],
    tags: ['HTML/CSS', 'JavaScript', 'Flask', 'Firebase', 'Python'],
    thumbnail: '/assets/projects/skillify/thumb.webp',
    repoUrl: 'https://github.com/BeFearless-cyberhead/Skillify',
    modal: {
      description: `Skillify is a skill-sharing and learning platform for communities: one place to share what you know, request a session with a verified member, borrow learning resources, and earn Skill Coins for contributing. It was designed around a chicken-and-egg problem every community tool faces — people will only come if there is something to gain — solved with a gamified reward loop that pays out for every contribution.

The architecture splits cleanly. The frontend is a set of static modules (dashboard, skill-share feed, borrow desk, learn catalogue, quiz/badges, auth) with no build step; the backend is a Flask REST API organised as one blueprint per feature, talking to Firebase on both sides — the client uses the Firebase JS SDK for authentication and real-time sync, while the server uses the Admin SDK for trusted writes to Firestore.

Identity and ownership rules are enforced server-side, and the Skill Coins ledger is written through a single service so balances stay coherent across sessions, borrowed resources, and quiz badges. The backend deploys on Railway with credentials injected as environment (never committed), while the static frontend can be served from anywhere.`,
      architecture: '/assets/projects/skillify/arch.svg',
      codeSnippet: {
        lang: 'javascript',
        code: `// frontend/js/auth.js — profile, toasts and the coin ledger
import { auth, db, BACKEND_URL } from './firebase-config.js';

SkillCoins.add(10, 'answered a community question');
SkillCoins.spend(5, 'requested a session with a mentor');

// Every credit/debit is one row in the shared ledger,
// so dashboard, borrow desk and quiz stay in agreement.`,
        caption: 'The gamification core: one ledger writes every Skill Coin movement.',
      },
    },
  },
];
