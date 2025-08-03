// app/markdown-previewer/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Markdown Previewer | Online Utility',
  description: 'Real-time Markdown previewer. Write Markdown on one side and see the rendered HTML on the other.',
  openGraph: {
    title: 'Markdown Previewer | Online Utility',
    description: 'Real-time Markdown previewer. Write Markdown on one side and see the rendered HTML on the other.',
    url: 'https://utility.crimsondevil.qzz.io/markdown-previewer',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Markdown Previewer | Online Utility',
    description: 'Real-time Markdown previewer. Write Markdown on one side and see the rendered HTML on the other.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
