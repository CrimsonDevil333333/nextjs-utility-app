// app/url-parser/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'URL Parser & Builder | Online Utility',
  description: 'Deconstruct and build URLs with ease. Parse existing URLs into components or construct new ones from scratch.',
  openGraph: {
    title: 'URL Parser & Builder | Online Utility',
    description: 'Deconstruct and build URLs with ease. Parse existing URLs into components or construct new ones from scratch.',
    url: 'https://utility.crimsondevil.qzz.io/url-parser',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'URL Parser & Builder | Online Utility',
    description: 'Deconstruct and build URLs with ease. Parse existing URLs into components or construct new ones from scratch.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
