// app/gem-match/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gem Match - Dev Toolkit',
  description: 'A simple and efficient Gem Match game.',
  openGraph: {
    title: 'Gem Match - Dev Toolkit',
    description: 'A simple and efficient Gem Match game.',
    url: 'https://utility.crimsondevil.qzz.io/gem-match',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Gem Match - Dev Toolkit',
    description: 'A simple and efficient Gem Match game.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
