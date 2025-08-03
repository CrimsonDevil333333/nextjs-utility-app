// app/currency-converter/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Currency Converter | Online Utility',
  description: 'Convert currencies with live exchange rates. Over 150 currencies supported.',
  openGraph: {
    title: 'Currency Converter | Online Utility',
    description: 'Convert currencies with live exchange rates. Over 150 currencies supported.',
    url: 'https://utility.crimsondevil.qzz.io/currency-converter',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Currency Converter | Online Utility',
    description: 'Convert currencies with live exchange rates. Over 150 currencies supported.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
