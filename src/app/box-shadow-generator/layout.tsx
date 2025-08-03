// app/box-shadow-generator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSS Box Shadow Generator | Online Utility',
  description: 'Create and customize complex box shadows with multiple layers. Get the CSS code instantly.',
  openGraph: {
    title: 'CSS Box Shadow Generator | Online Utility',
    description: 'Create and customize complex box shadows with multiple layers. Get the CSS code instantly.',
    url: 'https://utility.crimsondevil.qzz.io/box-shadow-generator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'CSS Box Shadow Generator | Online Utility',
    description: 'Create and customize complex box shadows with multiple layers. Get the CSS code instantly.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
