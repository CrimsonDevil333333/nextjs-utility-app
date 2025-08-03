// app/story-generator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Story Generator | Online Utility',
  description: 'Enter a prompt to generate a unique, creative story using AI. Choose genre and word count.',
  openGraph: {
    title: 'AI Story Generator | Online Utility',
    description: 'Enter a prompt to generate a unique, creative story using AI. Choose genre and word count.',
    url: 'https://utility.crimsondevil.qzz.io/story-generator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'AI Story Generator | Online Utility',
    description: 'Enter a prompt to generate a unique, creative story using AI. Choose genre and word count.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
