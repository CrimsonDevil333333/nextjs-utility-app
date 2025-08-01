import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Header from './_components/Header';
import HapticFeedbackModal from '@/components/utility/HapticFeedbackModal'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dev Toolkit - Your Essential Utilities',
  description: 'A comprehensive collection of handy web utilities for developers, designers, and everyday tasks.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown.min.css" />
      </head>
      {/* Use flexbox on the body and set it to min-h-screen */}
      <body className={`flex flex-col min-h-screen ${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <Header />
        <HapticFeedbackModal />
        {/* Use flex-grow to make the main content take up the remaining space */}
        <main className="flex-grow overflow-y-auto">
            {children}
        </main>
        <footer></footer>
      </body>
    </html>
  );
}