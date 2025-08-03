// app/tip-calculator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tip Calculator | Online Utility',
  description: 'Calculate tips and split bills with ease. Customize tip percentage and number of people.',
  openGraph: {
    title: 'Tip Calculator | Online Utility',
    description: 'Calculate tips and split bills with ease. Customize tip percentage and number of people.',
    url: 'https://utility.crimsondevil.qzz.io/tip-calculator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Tip Calculator | Online Utility',
    description: 'Calculate tips and split bills with ease. Customize tip percentage and number of people.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
