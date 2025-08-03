// app/jwt-decoder/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JWT Decoder & Verifier | Online Utility',
  description: 'Decode, inspect, and verify JWT tokens in real-time. A simple and powerful tool for developers.',
  openGraph: {
    title: 'JWT Decoder & Verifier | Online Utility',
    description: 'Decode, inspect, and verify JWT tokens in real-time. A simple and powerful tool for developers.',
    url: 'https://utility.crimsondevil.qzz.io/jwt-decoder',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'JWT Decoder & Verifier | Online Utility',
    description: 'Decode, inspect, and verify JWT tokens in real-time. A simple and powerful tool for developers.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
