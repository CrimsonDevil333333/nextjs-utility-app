// app/loan-calculator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loan Calculator | Online Utility',
  description: 'Estimate your monthly loan payments. See a breakdown of principal and interest.',
  openGraph: {
    title: 'Loan Calculator | Online Utility',
    description: 'Estimate your monthly loan payments. See a breakdown of principal and interest.',
    url: 'https://utility.crimsondevil.qzz.io/loan-calculator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Loan Calculator | Online Utility',
    description: 'Estimate your monthly loan payments. See a breakdown of principal and interest.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
