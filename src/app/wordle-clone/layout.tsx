// app/wordle-clone/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wordle Clone | Online Utility',
  description: 'Play a Wordle-inspired word guessing game. Guess the 5-letter word in 6 tries.',
  openGraph: {
    title: 'Wordle Clone | Online Utility',
    description: 'Play a Wordle-inspired word guessing game. Guess the 5-letter word in 6 tries.',
    url: 'https://utility.crimsondevil.qzz.io/wordle-clone',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Wordle Clone | Online Utility',
    description: 'Play a Wordle-inspired word guessing game. Guess the 5-letter word in 6 tries.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
