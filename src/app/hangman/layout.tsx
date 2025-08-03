// app/hangman/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hangman Game | Online Utility',
  description: 'Play the classic Hangman game online. Guess the word before the man is hanged!',
  openGraph: {
    title: 'Hangman Game | Online Utility',
    description: 'Play the classic Hangman game online. Guess the word before the man is hanged!',
    url: 'https://utility.crimsondevil.qzz.io/hangman',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Hangman Game | Online Utility',
    description: 'Play the classic Hangman game online. Guess the word before the man is hanged!',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
