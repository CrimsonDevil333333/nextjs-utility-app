// app/qr-code-generator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Code Generator | Online Utility',
  description: 'Create and customize your QR code. Generate QR codes for text, URLs, and more, then download them as PNG.',
  openGraph: {
    title: 'QR Code Generator | Online Utility',
    description: 'Create and customize your QR code. Generate QR codes for text, URLs, and more, then download them as PNG.',
    url: 'https://utility.crimsondevil.qzz.io/qr-code-generator',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'QR Code Generator | Online Utility',
    description: 'Create and customize your QR code. Generate QR codes for text, URLs, and more, then download them as PNG.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
