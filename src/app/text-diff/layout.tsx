// app/text-diff/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Text Difference Checker | Online Utility',
  description: 'Compare two texts and highlight the differences. View changes inline or side-by-side.',
  openGraph: {
    title: 'Text Difference Checker | Online Utility',
    description: 'Compare two texts and highlight the differences. View changes inline or side-by-side.',
    url: 'https://utility.crimsondevil.qzz.io/text-diff',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Text Difference Checker | Online Utility',
    description: 'Compare two texts and highlight the differences. View changes inline or side-by-side.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
