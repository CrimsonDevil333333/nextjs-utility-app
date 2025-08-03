// app/keyboard-tester/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Keyboard Tester | Online Utility',
  description: 'Test your keyboard online. Press any key to see it light up on the virtual keyboard.',
  openGraph: {
    title: 'Keyboard Tester | Online Utility',
    description: 'Test your keyboard online. Press any key to see it light up on the virtual keyboard.',
    url: 'https://utility.crimsondevil.qzz.io/keyboard-tester',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Keyboard Tester | Online Utility',
    description: 'Test your keyboard online. Press any key to see it light up on the virtual keyboard.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
