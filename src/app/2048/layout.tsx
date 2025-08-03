// app/2048/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2048 Game | Online Utility',
  description: 'Play the classic 2048 puzzle game online for free. Merge tiles, reach 2048, and challenge your friends. A simple and addictive web-based game.',
  openGraph: {
    title: '2048 Game | Online Utility',
    description: 'Play the classic 2048 puzzle game online for free. Merge tiles, reach 2048, and challenge your friends.',
    url: 'https://utility.crimsondevil.qzz.io/2048',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: '2048 Game | Online Utility',
    description: 'Play the classic 2048 puzzle game online for free. Merge tiles, reach 2048, and challenge your friends.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}