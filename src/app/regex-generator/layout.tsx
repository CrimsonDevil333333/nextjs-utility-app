// app/regex-generator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Regex Generator | Online Utility',
  description: 'Describe a text pattern in plain English to generate a regular expression using AI. Test your regex instantly.',
  openGraph: {
    title: 'AI Regex Generator | Online Utility',
    description: 'Describe a text pattern in plain English to generate a regular expression using AI. Test your regex instantly.',
    url: 'https://utility.crimsondevil.qzz.io/regex-generator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'AI Regex Generator | Online Utility',
    description: 'Describe a text pattern in plain English to generate a regular expression using AI. Test your regex instantly.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
