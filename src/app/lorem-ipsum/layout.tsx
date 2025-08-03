// app/lorem-ipsum/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator | Online Utility',
  description: 'Generate placeholder text for your designs and mockups. Choose the number of paragraphs, sentences, or words.',
  openGraph: {
    title: 'Lorem Ipsum Generator | Online Utility',
    description: 'Generate placeholder text for your designs and mockups. Choose the number of paragraphs, sentences, or words.',
    url: 'https://utility.crimsondevil.qzz.io/lorem-ipsum',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Lorem Ipsum Generator | Online Utility',
    description: 'Generate placeholder text for your designs and mockups. Choose the number of paragraphs, sentences, or words.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
