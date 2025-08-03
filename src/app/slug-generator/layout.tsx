// app/slug-generator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Slug Generator | Online Utility',
  description: 'Create clean, URL-friendly slugs from your text. Customize separators and case.',
  openGraph: {
    title: 'Slug Generator | Online Utility',
    description: 'Create clean, URL-friendly slugs from your text. Customize separators and case.',
    url: 'https://utility.crimsondevil.qzz.io/slug-generator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Slug Generator | Online Utility',
    description: 'Create clean, URL-friendly slugs from your text. Customize separators and case.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
