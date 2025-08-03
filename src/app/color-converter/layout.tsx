// app/color-converter/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Color Converter | Online Utility',
  description: 'Convert colors between HEX, RGB, and HSL formats. A simple and powerful tool for developers and designers.',
  openGraph: {
    title: 'Color Converter | Online Utility',
    description: 'Convert colors between HEX, RGB, and HSL formats. A simple and powerful tool for developers and designers.',
    url: 'https://utility.crimsondevil.qzz.io/color-converter',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Color Converter | Online Utility',
    description: 'Convert colors between HEX, RGB, and HSL formats. A simple and powerful tool for developers and designers.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
