'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Info, Settings } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const showHeader = pathname !== '/';

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  if (!showHeader) return null;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => {
            router.back();
            triggerHapticFeedback();
          }}
          className="flex items-center gap-2 rounded-full font-bold text-lg text-gray-900 dark:text-gray-100 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 p-2 pr-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Dev Toolkit</span>
        </button>

        <nav className="flex items-center gap-2">
          {pathname !== '/config' && (
            <Link
              href="/config"
              onClick={triggerHapticFeedback}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-700 dark:text-gray-200 shadow-sm transition-colors hover:bg-gray-200/80 dark:hover:bg-gray-700/80 border border-gray-200/50 dark:border-gray-700/50"
              title="Configuration"
            >
              <Settings className="h-5 w-5" />
            </Link>
          )}
          {pathname !== '/about' && (
            <Link
              href="/about"
              onClick={triggerHapticFeedback}
              className="inline-flex h-10 w-10 sm:w-auto items-center justify-center gap-2 rounded-full bg-blue-500 sm:px-4 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-600"
              title="About Us"
            >
              <Info className="h-5 w-5" />
              <span className="hidden sm:inline">About</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
