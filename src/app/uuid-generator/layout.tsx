// app/uuid-generator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UUID Generator | Online Utility',
  description: 'Generate universally unique identifiers (UUIDs) of versions 1 and 4. Generate multiple UUIDs at once.',
  openGraph: {
    title: 'UUID Generator | Online Utility',
    description: 'Generate universally unique identifiers (UUIDs) of versions 1 and 4. Generate multiple UUIDs at once.',
    url: 'https://utility.crimsondevil.qzz.io/uuid-generator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'UUID Generator | Online Utility',
    description: 'Generate universally unique identifiers (UUIDs) of versions 1 and 4. Generate multiple UUIDs at once.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
