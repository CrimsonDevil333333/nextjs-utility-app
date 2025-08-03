// app/url-encoder/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'URL Encoder / Decoder | Online Utility',
  description: 'Encode or decode your URLs and URI components. Supports both encodeURI and encodeURIComponent.',
  openGraph: {
    title: 'URL Encoder / Decoder | Online Utility',
    description: 'Encode or decode your URLs and URI components. Supports both encodeURI and encodeURIComponent.',
    url: 'https://utility.crimsondevil.qzz.io/url-encoder',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'URL Encoder / Decoder | Online Utility',
    description: 'Encode or decode your URLs and URI components. Supports both encodeURI and encodeURIComponent.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
