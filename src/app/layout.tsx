import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Utility Belt App',
  description: 'A collection of handy web utilities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="py-4 px-8 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="font-bold text-xl hover:text-blue-500 transition-colors">
            Utility App Home
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}