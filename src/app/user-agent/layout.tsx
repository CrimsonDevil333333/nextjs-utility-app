// app/user-agent/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User-Agent Finder | Online Utility',
  description: "View and parse your browser's User-Agent string. Get detailed information about your browser, OS, and device.",
  openGraph: {
    title: 'User-Agent Finder | Online Utility',
    description: "View and parse your browser's User-Agent string. Get detailed information about your browser, OS, and device.",
    url: 'https://utility.crimsondevil.qzz.io/user-agent',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'User-Agent Finder | Online Utility',
    description: "View and parse your browser's User-Agent string. Get detailed information about your browser, OS, and device.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
