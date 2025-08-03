// app/morse-code-translator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Morse Code Translator | Online Utility',
  description: 'Translate text to Morse code and vice versa. A simple and easy-to-use tool for converting messages.',
  openGraph: {
    title: 'Morse Code Translator | Online Utility',
    description: 'Translate text to Morse code and vice versa. A simple and easy-to-use tool for converting messages.',
    url: 'https://utility.crimsondevil.qzz.io/morse-code-translator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Morse Code Translator | Online Utility',
    description: 'Translate text to Morse code and vice versa. A simple and easy-to-use tool for converting messages.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
