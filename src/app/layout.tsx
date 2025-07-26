import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Header from './_components/Header'; // make sure this file uses 'use client'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dev Toolkit - Your Essential Utilities',
  description:
    'A comprehensive collection of handy web utilities for developers, designers, and everyday tasks.',
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
      <body className={`flex flex-col min-h-screen ${inter.className}`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <footer className="py-6 px-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <p>&copy; {new Date().getFullYear()} Satyaa G. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
            <a href="https://github.com/CrimsonDevil333333/nextjs-utility-app" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub Repo</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
