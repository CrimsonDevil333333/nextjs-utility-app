// app/number-base-converter/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Number Base Converter | Online Utility',
  description: 'Convert numbers between decimal, binary, hexadecimal, and octal. A simple and powerful tool for developers.',
  openGraph: {
    title: 'Number Base Converter | Online Utility',
    description: 'Convert numbers between decimal, binary, hexadecimal, and octal. A simple and powerful tool for developers.',
    url: 'https://utility.crimsondevil.qzz.io/number-base-converter',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Number Base Converter | Online Utility',
    description: 'Convert numbers between decimal, binary, hexadecimal, and octal. A simple and powerful tool for developers.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
