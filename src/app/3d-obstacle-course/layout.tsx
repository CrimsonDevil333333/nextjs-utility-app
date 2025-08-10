// app/3d-obstacle-course/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Obstacle Course - Dev Toolkit',
  description: 'A simple and efficient 3D Obstacle Course game.',
  openGraph: {
    title: '3D Obstacle Course - Dev Toolkit',
    description: 'A simple and efficient 3D Obstacle Course game.',
    url: 'https://utility.crimsondevil.qzz.io/3d-obstacle-course',
    siteName: 'Dev Toolkit',
  },
  twitter: {
    card: 'summary',
    title: '3D Obstacle Course - Dev Toolkit',
    description: 'A simple and efficient 3D Obstacle Course game.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
