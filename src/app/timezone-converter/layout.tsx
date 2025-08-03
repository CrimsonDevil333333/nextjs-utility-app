// app/timezone-converter/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Timezone Converter | Online Utility',
  description: 'View the current time in different timezones. Add and remove timezones to compare times around the world.',
  openGraph: {
    title: 'Timezone Converter | Online Utility',
    description: 'View the current time in different timezones. Add and remove timezones to compare times around the world.',
    url: 'https://utility.crimsondevil.qzz.io/timezone-converter',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Timezone Converter | Online Utility',
    description: 'View the current time in different timezones. Add and remove timezones to compare times around the world.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
