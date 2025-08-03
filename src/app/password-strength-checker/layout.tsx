// app/password-strength-checker/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Strength Checker | Online Utility',
  description: 'Check the strength of your password in real-time. Get feedback on how to make your password stronger.',
  openGraph: {
    title: 'Password Strength Checker | Online Utility',
    description: 'Check the strength of your password in real-time. Get feedback on how to make your password stronger.',
    url: 'https://utility.crimsondevil.qzz.io/password-strength-checker',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Password Strength Checker | Online Utility',
    description: 'Check the strength of your password in real-time. Get feedback on how to make your password stronger.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
