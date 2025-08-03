// app/hash-generator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hash Generator | Online Utility',
  description: 'Generate SHA-256 and SHA-512 hashes from your text. All calculations are done securely in your browser.',
  openGraph: {
    title: 'Hash Generator | Online Utility',
    description: 'Generate SHA-256 and SHA-512 hashes from your text. All calculations are done securely in your browser.',
    url: 'https://utility.crimsondevil.qzz.io/hash-generator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Hash Generator | Online Utility',
    description: 'Generate SHA-256 and SHA-512 hashes from your text. All calculations are done securely in your browser.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
