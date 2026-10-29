import type { Metadata } from 'next';
import { Playfair_Display, Syne, DM_Sans, DM_Mono } from 'next/font/google';
import { TrackProvider } from '@/context/TrackContext';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

const syne = Syne({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

const dmMono = DM_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ankit Maurya — AI Engineer & Data Analyst',
  description:
    'AI systems engineer and data analyst specialising in LangGraph, Python, and production-grade AI pipelines. See live projects and architecture deep-dives.',
  metadataBase: new URL('https://ankitkumar.dev'),
  openGraph: {
    title: 'Ankit Maurya — AI Engineer & Data Analyst',
    description:
      'AI systems engineer and data analyst specialising in LangGraph, Python, and production-grade AI pipelines. See live projects and architecture deep-dives.',
    url: 'https://ankitkumar.dev',
    siteName: 'Ankit Maurya Portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ankit Maurya — AI Engineer & Data Analyst',
    description:
      'AI systems engineer and data analyst specialising in LangGraph, Python, and production-grade AI pipelines.',
  },
  robots: { index: true, follow: true },
  other: {
    'theme-color': '#05070a',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ankit Maurya',
  jobTitle: 'AI Engineer & Data Analyst',
  url: 'https://ankitkumar.dev',
  image: 'https://ankitkumar.dev/og-image.png',
  sameAs: [
    'https://github.com/BeFearless-cyberhead',
    'https://linkedin.com/in/ankit-maurya-2123ab307',
  ],
  knowsAbout: [
    'Python', 'LangGraph', 'LangChain', 'Data Analytics',
    'AI Engineering', 'Prompt Engineering', 'Supabase', 'React',
  ],
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${syne.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Skip to content — accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>

        <TrackProvider>
          {/* The living temple scene renders behind this main element (Portal-free:
              page.tsx places it as position:fixed with z-index:-1) */}
          <main id="main-content">{children}</main>
        </TrackProvider>
      </body>
    </html>
  );
}
