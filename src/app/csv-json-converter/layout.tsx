// app/csv-json-converter/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSV to JSON Converter | Online Utility',
  description: 'Convert CSV data to JSON or JSON to CSV. A simple and powerful tool for developers and data analysts.',
  openGraph: {
    title: 'CSV to JSON Converter | Online Utility',
    description: 'Convert CSV data to JSON or JSON to CSV. A simple and powerful tool for developers and data analysts.',
    url: 'https://utility.crimsondevil.qzz.io/csv-json-converter',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'CSV to JSON Converter | Online Utility',
    description: 'Convert CSV data to JSON or JSON to CSV. A simple and powerful tool for developers and data analysts.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
