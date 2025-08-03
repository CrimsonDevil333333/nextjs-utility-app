// app/random-generator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Random Generator | Online Utility',
  description: 'Generate random numbers within a specified range or create secure, customizable passwords.',
  openGraph: {
    title: 'Random Generator | Online Utility',
    description: 'Generate random numbers within a specified range or create secure, customizable passwords.',
    url: 'https://utility.crimsondevil.qzz.io/random-generator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Random Generator | Online Utility',
    description: 'Generate random numbers within a specified range or create secure, customizable passwords.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
