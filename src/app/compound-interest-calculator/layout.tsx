// app/compound-interest-calculator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator | Online Utility',
  description: 'Calculate and visualize the future value of your investments with our compound interest calculator.',
  openGraph: {
    title: 'Compound Interest Calculator | Online Utility',
    description: 'Calculate and visualize the future value of your investments with our compound interest calculator.',
    url: 'https://utility.crimsondevil.qzz.io/compound-interest-calculator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Compound Interest Calculator | Online Utility',
    description: 'Calculate and visualize the future value of your investments with our compound interest calculator.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
