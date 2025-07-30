'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Info, Settings } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const showHeader = pathname !== '/';

  if (!showHeader) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Dev Toolkit</span>
        </button>

        <nav className="flex items-center gap-2">
          {pathname !== '/config' && (
            <Link
              href="/config"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 shadow-sm transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              title="Configuration"
            >
              <Settings className="h-5 w-5" />
            </Link>
          )}
          {pathname !== '/about' && (
            <Link
              href="/about"
              className="inline-flex h-10 w-10 sm:w-auto items-center justify-center gap-2 rounded-full bg-blue-500 sm:px-4 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-600"
              title="About Us"
            >
              <Info className="h-5 w-5" />
              <span className="hidden sm:inline">About Us</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
