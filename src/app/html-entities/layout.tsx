// app/html-entities/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HTML Entity Encoder/Decoder | Online Utility',
  description: 'Easily encode or decode HTML entities in your text. A simple and powerful tool for developers.',
  openGraph: {
    title: 'HTML Entity Encoder/Decoder | Online Utility',
    description: 'Easily encode or decode HTML entities in your text. A simple and powerful tool for developers.',
    url: 'https://utility.crimsondevil.qzz.io/html-entities',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'HTML Entity Encoder/Decoder | Online Utility',
    description: 'Easily encode or decode HTML entities in your text. A simple and powerful tool for developers.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
