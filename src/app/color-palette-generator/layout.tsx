// app/color-palette-generator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Color Palette Generator | Online Utility',
  description: 'Describe a theme or mood to generate a color palette using AI. Perfect for designers and developers.',
  openGraph: {
    title: 'AI Color Palette Generator | Online Utility',
    description: 'Describe a theme or mood to generate a color palette using AI. Perfect for designers and developers.',
    url: 'https://utility.crimsondevil.qzz.io/color-palette-generator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'AI Color Palette Generator | Online Utility',
    description: 'Describe a theme or mood to generate a color palette using AI. Perfect for designers and developers.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
