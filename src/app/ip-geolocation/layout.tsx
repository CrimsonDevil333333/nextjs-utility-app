// app/ip-geolocation/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IP Geolocation | Online Utility',
  description: 'Find the geographical location of any IP address. Get details like country, city, region, ISP, and organization.',
  openGraph: {
    title: 'IP Geolocation | Online Utility',
    description: 'Find the geographical location of any IP address. Get details like country, city, region, ISP, and organization.',
    url: 'https://utility.crimsondevil.qzz.io/ip-geolocation',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'IP Geolocation | Online Utility',
    description: 'Find the geographical location of any IP address. Get details like country, city, region, ISP, and organization.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
