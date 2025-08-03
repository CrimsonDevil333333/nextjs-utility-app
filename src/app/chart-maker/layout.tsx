// app/chart-maker/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chart & Graph Maker | Online Utility',
  description: 'Create bar, line, and pie charts from your data. Customize your chart and download it as a PNG.',
  openGraph: {
    title: 'Chart & Graph Maker | Online Utility',
    description: 'Create bar, line, and pie charts from your data. Customize your chart and download it as a PNG.',
    url: 'https://utility.crimsondevil.qzz.io/chart-maker',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Chart & Graph Maker | Online Utility',
    description: 'Create bar, line, and pie charts from your data. Customize your chart and download it as a PNG.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
