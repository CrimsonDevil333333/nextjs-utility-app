// app/coin-toss/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coin Toss | Online Utility',
  description: 'A simple and fun coin toss simulator. Flip a coin to get heads or tails.',
  openGraph: {
    title: 'Coin Toss | Online Utility',
    description: 'A simple and fun coin toss simulator. Flip a coin to get heads or tails.',
    url: 'https://utility.crimsondevil.qzz.io/coin-toss',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Coin Toss | Online Utility',
    description: 'A simple and fun coin toss simulator. Flip a coin to get heads or tails.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
