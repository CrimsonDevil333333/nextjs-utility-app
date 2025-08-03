// app/text-summarizer/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Text Summarizer | Online Utility',
  description: 'Get a concise summary of any long text using AI. Customize summary length and format (paragraph or bullets).',
  openGraph: {
    title: 'AI Text Summarizer | Online Utility',
    description: 'Get a concise summary of any long text using AI. Customize summary length and format (paragraph or bullets).',
    url: 'https://utility.crimsondevil.qzz.io/text-summarizer',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'AI Text Summarizer | Online Utility',
    description: 'Get a concise summary of any long text using AI. Customize summary length and format (paragraph or bullets).',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
