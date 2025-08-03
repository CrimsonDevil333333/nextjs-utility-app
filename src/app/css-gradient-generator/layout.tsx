// app/css-gradient-generator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSS Gradient Generator | Online Utility',
  description: 'Create beautiful CSS gradients with our easy-to-use generator. Customize colors, angle, and type (linear or radial) and get the CSS code instantly.',
  openGraph: {
    title: 'CSS Gradient Generator | Online Utility',
    description: 'Create beautiful CSS gradients with our easy-to-use generator. Customize colors, angle, and type (linear or radial) and get the CSS code instantly.',
    url: 'https://utility.crimsondevil.qzz.io/css-gradient-generator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'CSS Gradient Generator | Online Utility',
    description: 'Create beautiful CSS gradients with our easy-to-use generator. Customize colors, angle, and type (linear or radial) and get the CSS code instantly.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
