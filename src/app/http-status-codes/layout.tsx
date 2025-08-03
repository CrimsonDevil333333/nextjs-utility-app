// app/http-status-codes/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HTTP Status Codes | Online Utility',
  description: 'Quickly look up the meaning of any HTTP status code. A handy reference for developers.',
  openGraph: {
    title: 'HTTP Status Codes | Online Utility',
    description: 'Quickly look up the meaning of any HTTP status code. A handy reference for developers.',
    url: 'https://utility.crimsondevil.qzz.io/http-status-codes',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'HTTP Status Codes | Online Utility',
    description: 'Quickly look up the meaning of any HTTP status code. A handy reference for developers.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
