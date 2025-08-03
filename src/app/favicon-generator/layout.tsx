// app/favicon-generator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Favicon Generator | Online Utility',
  description: 'Create all favicon sizes from a single image. Supports PNG, JPG, and SVG formats.',
  openGraph: {
    title: 'Favicon Generator | Online Utility',
    description: 'Create all favicon sizes from a single image. Supports PNG, JPG, and SVG formats.',
    url: 'https://utility.crimsondevil.qzz.io/favicon-generator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Favicon Generator | Online Utility',
    description: 'Create all favicon sizes from a single image. Supports PNG, JPG, and SVG formats.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
