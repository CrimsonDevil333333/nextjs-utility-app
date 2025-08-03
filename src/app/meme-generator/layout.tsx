// app/meme-generator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meme Generator | Online Utility',
  description: 'Create your own memes instantly. Upload an image, add top and bottom text, and download your custom meme.',
  openGraph: {
    title: 'Meme Generator | Online Utility',
    description: 'Create your own memes instantly. Upload an image, add top and bottom text, and download your custom meme.',
    url: 'https://utility.crimsondevil.qzz.io/meme-generator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Meme Generator | Online Utility',
    description: 'Create your own memes instantly. Upload an image, add top and bottom text, and download your custom meme.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
