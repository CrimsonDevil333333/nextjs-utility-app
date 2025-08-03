// app/unit-price-calculator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unit Price Calculator | Online Utility',
  description: 'Compare items to find the best value. Calculate unit prices for different quantities and units.',
  openGraph: {
    title: 'Unit Price Calculator | Online Utility',
    description: 'Compare items to find the best value. Calculate unit prices for different quantities and units.',
    url: 'https://utility.crimsondevil.qzz.io/unit-price-calculator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Unit Price Calculator | Online Utility',
    description: 'Compare items to find the best value. Calculate unit prices for different quantities and units.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
