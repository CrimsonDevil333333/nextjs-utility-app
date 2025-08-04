'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

export const runtime = "edge";

export default function NotFoundPage() {
  return (
    <>
      <title>404: This page could not be found.</title>
      <main className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 text-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <h1 className="text-8xl font-extrabold text-blue-600 dark:text-blue-400">404</h1>
          <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">Page Not Found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
          <Link href="/" onClick={triggerHapticFeedback}>
            <button className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors">
              <Home size={18} />
              Go Back Home
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
