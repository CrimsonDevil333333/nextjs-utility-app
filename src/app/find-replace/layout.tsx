// app/find-replace/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find and Replace Text | Online Utility',
  description: 'Instantly find and replace text with advanced options like case sensitivity, whole word matching, and regular expressions.',
  openGraph: {
    title: 'Find and Replace Text | Online Utility',
    description: 'Instantly find and replace text with advanced options like case sensitivity, whole word matching, and regular expressions.',
    url: 'https://utility.crimsondevil.qzz.io/find-replace',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Find and Replace Text | Online Utility',
    description: 'Instantly find and replace text with advanced options like case sensitivity, whole word matching, and regular expressions.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
