// app/tetris/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tetris Game | Online Utility',
  description: 'Play the classic Tetris game online. Clear lines and score points in this addictive puzzle game.',
  openGraph: {
    title: 'Tetris Game | Online Utility',
    description: 'Play the classic Tetris game online. Clear lines and score points in this addictive puzzle game.',
    url: 'https://utility.crimsondevil.qzz.io/tetris',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Tetris Game | Online Utility',
    description: 'Play the classic Tetris game online. Clear lines and score points in this addictive puzzle game.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
