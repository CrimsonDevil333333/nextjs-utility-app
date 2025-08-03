// app/metric-converter/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unit Converter | Online Utility',
  description: 'Convert between various units of measurement including length, weight, volume, and temperature.',
  openGraph: {
    title: 'Unit Converter | Online Utility',
    description: 'Convert between various units of measurement including length, weight, volume, and temperature.',
    url: 'https://utility.crimsondevil.qzz.io/metric-converter',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Unit Converter | Online Utility',
    description: 'Convert between various units of measurement including length, weight, volume, and temperature.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
