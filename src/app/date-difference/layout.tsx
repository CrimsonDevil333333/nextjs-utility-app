// app/date-difference/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Date Difference Calculator | Online Utility',
  description: 'Calculate the difference between two dates in years, months, and days. You can also add or subtract a duration from a date.',
  openGraph: {
    title: 'Date Difference Calculator | Online Utility',
    description: 'Calculate the difference between two dates in years, months, and days. You can also add or subtract a duration from a date.',
    url: 'https://utility.crimsondevil.qzz.io/date-difference',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Date Difference Calculator | Online Utility',
    description: 'Calculate the difference between two dates in years, months, and days. You can also add or subtract a duration from a date.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
