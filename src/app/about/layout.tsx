// app/about/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Dev Toolkit',
  description: 'Learn more about the Dev Toolkit project, its mission, and its creator, Satyaa G.',
  openGraph: {
    title: 'About - Dev Toolkit',
    description: 'Learn more about the Dev Toolkit project, its mission, and its creator, Satyaa G.',
    url: 'https://utility.crimsondevil.qzz.io/about',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'About - Dev Toolkit',
    description: 'Learn more about the Dev Toolkit project, its mission, and its creator, Satyaa G.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
