// app/readability-score/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Readability Score Analyzer | Online Utility',
  description: "Analyze your text's reading level using the Flesch-Kincaid readability test. Get insights into your content's complexity.'",
  openGraph: {
    title: 'Readability Score Analyzer | Online Utility',
    description: "Analyze your text's reading level using the Flesch-Kincaid readability test. Get insights into your content's complexity.",
    url: 'https://utility.crimsondevil.qzz.io/readability-score',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Readability Score Analyzer | Online Utility',
    description: "Analyze your text's reading level using the Flesch-Kincaid readability test. Get insights into your content's complexity.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
