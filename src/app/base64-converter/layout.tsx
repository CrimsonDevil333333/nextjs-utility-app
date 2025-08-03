// app/base64-converter/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Base64 Converter | Online Utility',
  description: 'Encode and decode Base64 strings. You can also upload a file to encode it to Base64.',
  openGraph: {
    title: 'Base64 Converter | Online Utility',
    description: 'Encode and decode Base64 strings. You can also upload a file to encode it to Base64.',
    url: 'https://utility.crimsondevil.qzz.io/base64-converter',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Base64 Converter | Online Utility',
    description: 'Encode and decode Base64 strings. You can also upload a file to encode it to Base64.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
