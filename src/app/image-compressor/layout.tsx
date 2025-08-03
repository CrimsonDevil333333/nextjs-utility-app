// app/image-compressor/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Compressor | Online Utility',
  description: 'Compress images in your browser without uploading to a server. Reduce file size while maintaining quality.',
  openGraph: {
    title: 'Image Compressor | Online Utility',
    description: 'Compress images in your browser without uploading to a server. Reduce file size while maintaining quality.',
    url: 'https://utility.crimsondevil.qzz.io/image-compressor',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Image Compressor | Online Utility',
    description: 'Compress images in your browser without uploading to a server. Reduce file size while maintaining quality.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
