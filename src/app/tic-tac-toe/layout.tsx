// app/tic-tac-toe/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tic Tac Toe Game | Online Utility',
  description: 'Play the classic Tic Tac Toe game against a friend or the AI. A simple and fun game for all ages.',
  openGraph: {
    title: 'Tic Tac Toe Game | Online Utility',
    description: 'Play the classic Tic Tac Toe game against a friend or the AI. A simple and fun game for all ages.',
    url: 'https://utility.crimsondevil.qzz.io/tic-tac-toe',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Tic Tac Toe Game | Online Utility',
    description: 'Play the classic Tic Tac Toe game against a friend or the AI. A simple and fun game for all ages.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
