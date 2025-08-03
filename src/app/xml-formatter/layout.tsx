// app/xml-formatter/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'XML Formatter | Online Utility',
  description: 'Convert your scrambled XML file to a valid and beautifully formatted XML output. Beautify and validate XML data.',
  openGraph: {
    title: 'XML Formatter | Online Utility',
    description: 'Convert your scrambled XML file to a valid and beautifully formatted XML output. Beautify and validate XML data.',
    url: 'https://utility.crimsondevil.qzz.io/xml-formatter',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'XML Formatter | Online Utility',
    description: 'Convert your scrambled XML file to a valid and beautifully formatted XML output. Beautify and validate XML data.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
