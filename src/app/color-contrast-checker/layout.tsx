// app/color-contrast-checker/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Color Contrast Checker | Online Utility',
  description: 'Check color contrast against WCAG accessibility standards. Ensure your text is readable for everyone.',
  openGraph: {
    title: 'Color Contrast Checker | Online Utility',
    description: 'Check color contrast against WCAG accessibility standards. Ensure your text is readable for everyone.',
    url: 'https://utility.crimsondevil.qzz.io/color-contrast-checker',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Color Contrast Checker | Online Utility',
    description: 'Check color contrast against WCAG accessibility standards. Ensure your text is readable for everyone.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
