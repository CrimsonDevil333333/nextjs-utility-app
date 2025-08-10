// app/color-flood/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Color Flood - Dev Toolkit',
  description: 'A simple and efficient Color Flood game.',
  openGraph: {
    title: 'Color Flood - Dev Toolkit',
    description: 'A simple and efficient Color Flood game.',
    url: 'https://utility.crimsondevil.qzz.io/color-flood',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Color Flood - Dev Toolkit',
    description: 'A simple and efficient Color Flood game.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
