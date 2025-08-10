// app/sliding-puzzle/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sliding Puzzle - Dev Toolkit',
  description: 'A simple and efficient Sliding Puzzle game.',
  openGraph: {
    title: 'Sliding Puzzle - Dev Toolkit',
    description: 'A simple and efficient Sliding Puzzle game.',
    url: 'https://utility.crimsondevil.qzz.io/sliding-puzzle',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Sliding Puzzle - Dev Toolkit',
    description: 'A simple and efficient Sliding Puzzle game.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
