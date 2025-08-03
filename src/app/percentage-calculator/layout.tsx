// app/percentage-calculator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Percentage Calculator | Online Utility',
  description: 'Calculate percentages with ease. Find percentage of a number, what percentage one number is of another, and percentage increase/decrease.',
  openGraph: {
    title: 'Percentage Calculator | Online Utility',
    description: 'Calculate percentages with ease. Find percentage of a number, what percentage one number is of another, and percentage increase/decrease.',
    url: 'https://utility.crimsondevil.qzz.io/percentage-calculator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Percentage Calculator | Online Utility',
    description: 'Calculate percentages with ease. Find percentage of a number, what percentage one number is of another, and percentage increase/decrease.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
