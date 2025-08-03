// app/connect-four/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connect Four Game | Online Utility',
  description: 'Play the classic Connect Four game against another player or the computer. Drop your discs and try to get four in a row!',
  openGraph: {
    title: 'Connect Four Game | Online Utility',
    description: 'Play the classic Connect Four game against another player or the computer. Drop your discs and try to get four in a row!',
    url: 'https://utility.crimsondevil.qzz.io/connect-four',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Connect Four Game | Online Utility',
    description: 'Play the classic Connect Four game against another player or the computer. Drop your discs and try to get four in a row!',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
