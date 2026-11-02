export interface ChatReply {
  content: string;
  links?: { label: string; href: string }[];
}

export const chatPrompts = [
  'Show me your projects',
  'What tools do you use?',
  'How can I get in touch?',
];

export const chatWelcome: ChatReply = {
  content:
    'Hi, I’m Lantern, Ankit’s portfolio companion. I’m in preview mode for now — try a question about projects, tools, or getting in touch.',
};

// Local, curated preview only. Connect this UI to a server-side AI endpoint
// when the portfolio knowledge base is ready.
export function getPreviewReply(question: string): ChatReply {
  const text = question.toLowerCase();

  if (/\b(contact|touch|email|hire|hiring|opportunit\w*|collaborat\w*|linkedin)\b/.test(text)) {
    return {
      content:
        'Use the form beside me to send Ankit a message, or connect directly on LinkedIn. You can also explore his public work on GitHub.',
      links: [
        { label: 'LinkedIn ↗', href: 'https://linkedin.com/in/ankit-maurya-2123ab307' },
        { label: 'GitHub ↗', href: 'https://github.com/BeFearless-cyberhead' },
      ],
    };
  }

  if (/\b(projects?|work|built|building|portfolio)\b/.test(text)) {
    return {
      content:
        'Explore SMS Spam Detector for applied machine learning, SourceLens for grounded document answers, and the Sales Analytics Dashboard for data insights. Each project card opens its case study.',
      links: [{ label: 'Explore the projects ↑', href: '#projects' }],
    };
  }

  if (/\b(tools?|stack|skills?|technolog\w*|python|sql|pandas|langgraph)\b/.test(text)) {
    return {
      content:
        'Ankit’s toolkit connects Python, Pandas, Jupyter, and SQL with LangGraph, vector search, React, and TypeScript. The toolkit section shows the complete collection.',
      links: [{ label: 'See the toolkit ↑', href: '#arsenal' }],
    };
  }

  return {
    content:
      'My custom knowledge isn’t connected yet, so I can’t answer that reliably. For now, try one of the suggested questions, or send Ankit a note using the form.',
  };
}
