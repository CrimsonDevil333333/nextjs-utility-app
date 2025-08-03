// app/solitaire/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solitaire Game | Online Utility',
  description: 'Play the classic Solitaire (Klondike) card game online. Enjoy a relaxing game of Solitaire in your browser.',
  openGraph: {
    title: 'Solitaire Game | Online Utility',
    description: 'Play the classic Solitaire (Klondike) card game online. Enjoy a relaxing game of Solitaire in your browser.',
    url: 'https://utility.crimsondevil.qzz.io/solitaire',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Solitaire Game | Online Utility',
    description: 'Play the classic Solitaire (Klondike) card game online. Enjoy a relaxing game of Solitaire in your browser.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
