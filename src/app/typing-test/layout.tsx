// app/typing-test/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Typing Speed Test | Online Utility',
  description: 'Test your typing speed and accuracy. Improve your WPM with a simple and effective typing test.',
  openGraph: {
    title: 'Typing Speed Test | Online Utility',
    description: 'Test your typing speed and accuracy. Improve your WPM with a simple and effective typing test.',
    url: 'https://utility.crimsondevil.qzz.io/typing-test',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Typing Speed Test | Online Utility',
    description: 'Test your typing speed and accuracy. Improve your WPM with a simple and effective typing test.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
