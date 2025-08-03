// app/word-counter/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Word, Character, & Line Counter | Online Utility',
  description: "Analyze your text's statistics in real-time. Count words, characters (with and without spaces), and lines. Estimate reading time.",
  openGraph: {
    title: 'Word, Character, & Line Counter | Online Utility',
    description: "Analyze your text's statistics in real-time. Count words, characters (with and without spaces), and lines. Estimate reading time.",
    url: 'https://utility.crimsondevil.qzz.io/word-counter',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Word, Character, & Line Counter | Online Utility',
    description: "Analyze your text's statistics in real-time. Count words, characters (with and without spaces), and lines. Estimate reading time.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
