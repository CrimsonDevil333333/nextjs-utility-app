// app/snake-game/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Snake Game | Online Utility',
  description: "Play the classic Snake game online. Grow your snake by eating food, but don't hit the walls or yourself!",
  openGraph: {
    title: 'Snake Game | Online Utility',
    description: "Play the classic Snake game online. Grow your snake by eating food, but don't hit the walls or yourself!",
    url: 'https://utility.crimsondevil.qzz.io/snake-game',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Snake Game | Online Utility',
    description: "Play the classic Snake game online. Grow your snake by eating food, but don't hit the walls or yourself!",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
