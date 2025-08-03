// app/scientific-calculator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scientific Calculator | Online Utility',
  description: 'A powerful online scientific calculator with basic and advanced functions, including trigonometry, logarithms, and history.',
  openGraph: {
    title: 'Scientific Calculator | Online Utility',
    description: 'A powerful online scientific calculator with basic and advanced functions, including trigonometry, logarithms, and history.',
    url: 'https://utility.crimsondevil.qzz.io/scientific-calculator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Scientific Calculator | Online Utility',
    description: 'A powerful online scientific calculator with basic and advanced functions, including trigonometry, logarithms, and history.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
