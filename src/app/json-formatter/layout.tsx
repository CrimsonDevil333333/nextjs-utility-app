// app/json-formatter/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator | Online Utility',
  description: 'Format, validate, and beautify your JSON data with ease. A simple and powerful tool for developers.',
  openGraph: {
    title: 'JSON Formatter & Validator | Online Utility',
    description: 'Format, validate, and beautify your JSON data with ease. A simple and powerful tool for developers.',
    url: 'https://utility.crimsondevil.qzz.io/json-formatter',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'JSON Formatter & Validator | Online Utility',
    description: 'Format, validate, and beautify your JSON data with ease. A simple and powerful tool for developers.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
