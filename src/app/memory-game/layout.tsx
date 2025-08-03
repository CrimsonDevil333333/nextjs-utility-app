// app/memory-game/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memory Game | Online Utility',
  description: 'Play a classic memory matching game. Test your memory skills by matching pairs of cards.',
  openGraph: {
    title: 'Memory Game | Online Utility',
    description: 'Play a classic memory matching game. Test your memory skills by matching pairs of cards.',
    url: 'https://utility.crimsondevil.qzz.io/memory-game',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Memory Game | Online Utility',
    description: 'Play a classic memory matching game. Test your memory skills by matching pairs of cards.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
