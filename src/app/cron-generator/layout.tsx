// app/cron-generator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cron Job Generator | Online Utility',
  description: 'Generate cron job expressions with an easy-to-use interface. Select from presets or create a custom schedule.',
  openGraph: {
    title: 'Cron Job Generator | Online Utility',
    description: 'Generate cron job expressions with an easy-to-use interface. Select from presets or create a custom schedule.',
    url: 'https://utility.crimsondevil.qzz.io/cron-generator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Cron Job Generator | Online Utility',
    description: 'Generate cron job expressions with an easy-to-use interface. Select from presets or create a custom schedule.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
