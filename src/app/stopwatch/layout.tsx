// app/stopwatch/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stopwatch | Online Utility',
  description: 'A simple and accurate stopwatch with lap functionality. Track time with precision.',
  openGraph: {
    title: 'Stopwatch | Online Utility',
    description: 'A simple and accurate stopwatch with lap functionality. Track time with precision.',
    url: 'https://utility.crimsondevil.qzz.io/stopwatch',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Stopwatch | Online Utility',
    description: 'A simple and accurate stopwatch with lap functionality. Track time with precision.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
