// app/image-color-picker/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Color Picker | Online Utility',
  description: 'Upload an image and pick any color with a magnifying loupe. Get the color in HEX, RGB, and HSL formats.',
  openGraph: {
    title: 'Image Color Picker | Online Utility',
    description: 'Upload an image and pick any color with a magnifying loupe. Get the color in HEX, RGB, and HSL formats.',
    url: 'https://utility.crimsondevil.qzz.io/image-color-picker',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: 'Image Color Picker | Online Utility',
    description: 'Upload an image and pick any color with a magnifying loupe. Get the color in HEX, RGB, and HSL formats.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
