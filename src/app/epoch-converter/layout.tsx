// app/epoch-converter/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Epoch & Unix Timestamp Converter | Online Utility',
  description: 'Convert timestamps to human-readable dates and vice-versa. A simple and powerful tool for developers.',
  openGraph: {
    title: 'Epoch & Unix Timestamp Converter | Online Utility',
    description: 'Convert timestamps to human-readable dates and vice-versa. A simple and powerful tool for developers.',
    url: 'https://utility.crimsondevil.qzz.io/epoch-converter',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Epoch & Unix Timestamp Converter | Online Utility',
    description: 'Convert timestamps to human-readable dates and vice-versa. A simple and powerful tool for developers.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
