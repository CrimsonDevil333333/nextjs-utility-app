// app/minesweeper/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Minesweeper Game | Online Utility',
  description: 'Play the classic Minesweeper game online. Clear the board without hitting a mine.',
  openGraph: {
    title: 'Minesweeper Game | Online Utility',
    description: 'Play the classic Minesweeper game online. Clear the board without hitting a mine.',
    url: 'https://utility.crimsondevil.qzz.io/minesweeper',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Minesweeper Game | Online Utility',
    description: 'Play the classic Minesweeper game online. Clear the board without hitting a mine.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
