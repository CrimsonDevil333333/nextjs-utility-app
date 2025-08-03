// app/chess/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chess Game | Online Utility',
  description: 'Play chess against another player or the computer. Analyze your games and improve your skills.',
  openGraph: {
    title: 'Chess Game | Online Utility',
    description: 'Play chess against another player or the computer. Analyze your games and improve your skills.',
    url: 'https://utility.crimsondevil.qzz.io/chess',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Chess Game | Online Utility',
    description: 'Play chess against another player or the computer. Analyze your games and improve your skills.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
