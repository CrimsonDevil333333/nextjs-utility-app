// app/config/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Configuration | Online Utility',
  description: 'Manage your API keys and application settings.',
  openGraph: {
    title: 'Configuration | Online Utility',
    description: 'Manage your API keys and application settings.',
    url: 'https://utility.crimsondevil.qzz.io/config',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Configuration | Online Utility',
    description: 'Manage your API keys and application settings.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
