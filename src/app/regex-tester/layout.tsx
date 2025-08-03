// app/regex-tester/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regex Tester | Online Utility',
  description: 'Test your regular expressions in real-time. Highlight matches, view captured groups, and get explanations.',
  openGraph: {
    title: 'Regex Tester | Online Utility',
    description: 'Test your regular expressions in real-time. Highlight matches, view captured groups, and get explanations.',
    url: 'https://utility.crimsondevil.qzz.io/regex-tester',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Regex Tester | Online Utility',
    description: 'Test your regular expressions in real-time. Highlight matches, view captured groups, and get explanations.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
