// app/sql-query-generator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI SQL Query Generator | Online Utility',
  description: 'Describe what you need in plain English to generate a SQL query using AI. Supports various SQL dialects.',
  openGraph: {
    title: 'AI SQL Query Generator | Online Utility',
    description: 'Describe what you need in plain English to generate a SQL query using AI. Supports various SQL dialects.',
    url: 'https://utility.crimsondevil.qzz.io/sql-query-generator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'AI SQL Query Generator | Online Utility',
    description: 'Describe what you need in plain English to generate a SQL query using AI. Supports various SQL dialects.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
