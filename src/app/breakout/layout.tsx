// app/breakout/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Breakout Game | Online Utility',
  description: 'Play the classic Breakout game online. Break all the bricks to win, and try to get the high score!',
  openGraph: {
    title: 'Breakout Game | Online Utility',
    description: 'Play the classic Breakout game online. Break all the bricks to win, and try to get the high score!',
    url: 'https://utility.crimsondevil.qzz.io/breakout',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Breakout Game | Online Utility',
    description: 'Play the classic Breakout game online. Break all the bricks to win, and try to get the high score!',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
