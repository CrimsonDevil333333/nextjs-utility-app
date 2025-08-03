// app/language-translator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Language Translator | Online Utility',
  description: 'Translate text between different languages using AI. Supports multiple languages.',
  openGraph: {
    title: 'Language Translator | Online Utility',
    description: 'Translate text between different languages using AI. Supports multiple languages.',
    url: 'https://utility.crimsondevil.qzz.io/language-translator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Language Translator | Online Utility',
    description: 'Translate text between different languages using AI. Supports multiple languages.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
