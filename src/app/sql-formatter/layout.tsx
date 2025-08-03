// app/sql-formatter/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SQL Formatter | Online Utility',
  description: 'Format and beautify your SQL queries with ease. Supports various SQL dialects and customization options.',
  openGraph: {
    title: 'SQL Formatter | Online Utility',
    description: 'Format and beautify your SQL queries with ease. Supports various SQL dialects and customization options.',
    url: 'https://utility.crimsondevil.qzz.io/sql-formatter',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'SQL Formatter | Online Utility',
    description: 'Format and beautify your SQL queries with ease. Supports various SQL dialects and customization options.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
