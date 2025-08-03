// app/dice-roll/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dice Roller | Online Utility',
  description: 'A simple and interactive dice roller. Roll one or more dice, see the history of your rolls, and use it for games or decision making.',
  openGraph: {
    title: 'Dice Roller | Online Utility',
    description: 'A simple and interactive dice roller. Roll one or more dice, see the history of your rolls, and use it for games or decision making.',
    url: 'https://utility.crimsondevil.qzz.io/dice-roll',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Dice Roller | Online Utility',
    description: 'A simple and interactive dice roller. Roll one or more dice, see the history of your rolls, and use it for games or decision making.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
