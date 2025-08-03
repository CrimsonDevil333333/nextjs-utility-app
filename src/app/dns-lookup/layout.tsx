// app/dns-lookup/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DNS Lookup | Online Utility',
  description: 'Find DNS records for any domain. Supports A, AAAA, MX, TXT, NS, and CNAME records.',
  openGraph: {
    title: 'DNS Lookup | Online Utility',
    description: 'Find DNS records for any domain. Supports A, AAAA, MX, TXT, NS, and CNAME records.',
    url: 'https://utility.crimsondevil.qzz.io/dns-lookup',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'DNS Lookup | Online Utility',
    description: 'Find DNS records for any domain. Supports A, AAAA, MX, TXT, NS, and CNAME records.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
