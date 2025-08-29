import { Suspense } from 'react';
import HomePageContent from '@/app/HomePageContent'; // Make sure the path is correct

// A simple skeleton loader to show while the main component loads
function LoadingSkeleton() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto py-8 animate-pulse">
        {/* Header Skeleton */}
        <header className="text-center mb-12">
          <div className="h-10 sm:h-16 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/2 mx-auto mb-4"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded-lg w-3/4 mx-auto"></div>
        </header>

        {/* Search & Filter Skeleton */}
        <section className="mb-12">
          <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded-full mb-6"></div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}