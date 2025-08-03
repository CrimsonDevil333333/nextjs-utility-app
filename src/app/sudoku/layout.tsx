// app/sudoku/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sudoku Game | Online Utility',
  description: 'Play the classic Sudoku puzzle game online. Generate new puzzles with different difficulty levels.',
  openGraph: {
    title: 'Sudoku Game | Online Utility',
    description: 'Play the classic Sudoku puzzle game online. Generate new puzzles with different difficulty levels.',
    url: 'https://utility.crimsondevil.qzz.io/sudoku',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Sudoku Game | Online Utility',
    description: 'Play the classic Sudoku puzzle game online. Generate new puzzles with different difficulty levels.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
