import type { Metadata } from 'next';
import { Playfair_Display, Syne, DM_Sans, DM_Mono } from 'next/font/google';
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
  title: 'Ankit Maurya — Data Science & AI Engineer',
  description:
    'Data science and AI portfolio by Ankit Maurya, featuring analytical projects, machine-learning systems, and production-minded experiments.',
  metadataBase: new URL('https://ankitkumar.dev'),
  openGraph: {
    title: 'Ankit Maurya — Data Science & AI Engineer',
    description:
      'Data science and AI portfolio featuring analytical projects, machine-learning systems, and production-minded experiments.',
    url: 'https://ankitkumar.dev',
    siteName: 'Ankit Maurya Portfolio',
    images: [{ url: '/hero-bg.webp', width: 1024, height: 1024 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ankit Maurya — Data Science & AI Engineer',
    description:
      'Data science and AI portfolio featuring analytical projects, machine-learning systems, and production-minded experiments.',
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
  jobTitle: 'Data Science & AI Engineer',
  url: 'https://ankitkumar.dev',
  image: 'https://ankitkumar.dev/hero-bg.webp',
  sameAs: [
    'https://github.com/BeFearless-cyberhead',
    'https://linkedin.com/in/ankit-maurya-2123ab307',
  ],
  knowsAbout: [
    'Python', 'Pandas', 'SQL', 'scikit-learn', 'Data Visualization',
    'LangGraph', 'LangChain', 'Data Analytics', 'AI Engineering',
    'Prompt Engineering', 'Supabase', 'React',
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

        {/* The living temple scene renders behind this main element. */}
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
