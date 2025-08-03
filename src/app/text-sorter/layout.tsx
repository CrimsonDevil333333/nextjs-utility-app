// app/text-sorter/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Text Sorter | Online Utility',
  description: 'Sort, filter, and manage your text lines effortlessly. Sort alphabetically, by length, reverse, or remove duplicates.',
  openGraph: {
    title: 'Text Sorter | Online Utility',
    description: 'Sort, filter, and manage your text lines effortlessly. Sort alphabetically, by length, reverse, or remove duplicates.',
    url: 'https://utility.crimsondevil.qzz.io/text-sorter',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Text Sorter | Online Utility',
    description: 'Sort, filter, and manage your text lines effortlessly. Sort alphabetically, by length, reverse, or remove duplicates.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
