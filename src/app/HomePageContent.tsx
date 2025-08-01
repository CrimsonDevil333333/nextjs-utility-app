'use client';

import Link from 'next/link';
import { Info, ChevronDown, ChevronUp, ArrowUp, Settings, X } from 'lucide-react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { utilities, Utility } from '@/app/data/utilities';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Debounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Sub-component for individual utility cards
function UtilityCard({ util }: { util: Utility }) {
  return (
    <Link href={util.href} key={util.name} className="group block h-full animate-card-fade-in" onClick={triggerHapticFeedback}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-700 h-full flex flex-col justify-between">
        <div>
          <span className="text-4xl mb-4 block transform group-hover:scale-110 transition-transform duration-300 ease-in-out">{util.emoji}</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{util.name}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{util.description}</p>
        </div>
        <div className="mt-4 text-blue-600 dark:text-blue-400 flex items-center group-hover:translate-x-1 transition-transform duration-200 text-sm">
          Go to tool
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </Link>
  );
}

// --- Style mapping for category pills ---
const CATEGORY_COLORS: Record<string, string> = {
  'Converters': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
  'Developers': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
  'Finance': 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200',
  'Security': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  'Design': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200',
  'Text': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
  'Time & Date': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
  'Math': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
  'Tools': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
  'Games': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200',
  'Health': 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
  'Network': 'bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-200',
  'AI Tools': 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200',
  'All': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200'
};

// --- Define the desired category order ---
const CATEGORY_ORDER = [
  'Tools', 'Text', 'Time & Date', 'Converters', 'Math',
  'Design', 'Network', 'Security', 'Finance', 'Health',
  'Developers', 'AI Tools', 'Games'
];

export default function HomePageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // --- START FIX for Hydration Error ---
  // Initialize selectedCategory consistently on both server and client.
  // The client-specific logic will run in a useEffect after hydration.
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const initialCategory = searchParams.get('category');
    // If a category is specified in the URL, use it.
    if (initialCategory) {
      return initialCategory;
    }
    // Otherwise, default to null on both server and client for the initial render.
    // The mobile-specific default will be applied client-side in useEffect.
    return null;
  });

  // Effect to set 'All' as default category for mobile screens ONLY on the client-side.
  useEffect(() => {
    // This effect runs only on the client after the component has mounted/hydrated.
    // Check if no category is specified in the URL AND it's a small screen.
    if (!searchParams.get('category') && window.innerWidth < 640) {
      setSelectedCategory('All');
    }
  }, [searchParams]); // Re-run if searchParams change (e.g., user navigates)
  // --- END FIX for Hydration Error ---

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [dynamicFilterCategories, setDynamicFilterCategories] = useState<{ name: string, emoji: string }[]>([]);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const groupedUtilities = useMemo(() => {
    return utilities.reduce((acc, util) => {
      (acc[util.category] = acc[util.category] || []).push(util);
      return acc;
    }, {} as Record<string, Utility[]>);
  }, []);

  const sortedCategories = useMemo(() => {
    const allCategories = Object.keys(groupedUtilities);
    const orderMap = CATEGORY_ORDER.reduce((acc, cat, index) => {
      acc[cat] = index;
      return acc;
    }, {} as Record<string, number>);

    return allCategories.sort((a, b) => {
      const orderA = a in orderMap ? orderMap[a] : Number.MAX_SAFE_INTEGER;
      const orderB = b in orderMap ? orderMap[b] : Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return a.localeCompare(b);
    });
  }, [groupedUtilities]);

  useEffect(() => {
    if (sortedCategories.length === 0) return;
    const filters = sortedCategories.map(category => {
      const utilsInCategory = groupedUtilities[category];
      // Defensive check: ensure utilsInCategory is not undefined or empty before accessing
      if (!utilsInCategory || utilsInCategory.length === 0) return { name: category, emoji: '❓' };
      const randomUtil = utilsInCategory[Math.floor(Math.random() * utilsInCategory.length)];
      return { name: category, emoji: randomUtil.emoji };
    });
    setDynamicFilterCategories([{ name: 'All', emoji: '🌟' }, ...filters]);
  }, [sortedCategories, groupedUtilities]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
    else params.delete('search');

    if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
    else params.delete('category');

    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearchTerm, selectedCategory, pathname, router]);

  useEffect(() => {
    const savedState = localStorage.getItem('expandedCategories');
    if (savedState) setExpandedCategories(JSON.parse(savedState));
    else {
      const initialState = Object.keys(groupedUtilities).reduce((acc, category) => {
        acc[category] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedCategories(initialState);
    }
  }, [groupedUtilities]);

  useEffect(() => {
    if (Object.keys(expandedCategories).length > 0) {
      localStorage.setItem('expandedCategories', JSON.stringify(expandedCategories));
    }
  }, [expandedCategories]);

  const filteredUtilities = useMemo(() => {
    const term = debouncedSearchTerm.toLowerCase();
    const category = selectedCategory; // Use selectedCategory directly
    if (!category && !term) return []; // If no category selected and no search term, show nothing initially

    return utilities.filter(util => {
      const categoryMatch = !category || category === 'All' || util.category === category;
      const searchMatch = !term || util.name.toLowerCase().includes(term) || util.description.toLowerCase().includes(term) || util.category.toLowerCase().includes(term);
      return categoryMatch && searchMatch;
    });
  }, [debouncedSearchTerm, selectedCategory]);

  const handleScroll = useCallback(() => setShowScrollToTop(window.scrollY > 300), []);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); triggerHapticFeedback(); };
  const toggleCategory = (category: string) => { setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] })); triggerHapticFeedback(); };
  const setAllCategoriesExpanded = (isExpanded: boolean) => {
    const newState = Object.keys(groupedUtilities).reduce((acc, key) => {
      acc[key] = isExpanded;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedCategories(newState);
    triggerHapticFeedback();
  };

  const handleFilterClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsFilterModalOpen(false);
    triggerHapticFeedback();
  };

  // shouldShowContent should now correctly reflect if a filter is active or search term is present.
  const isFiltered = debouncedSearchTerm !== '' || (selectedCategory !== null && selectedCategory !== 'All');
  // Initially, if no search term and no category selected (selectedCategory is null), show all categories.
  // If selectedCategory is 'All', it means the "All" filter is active, so show all.
  const shouldShowContent = debouncedSearchTerm !== '' || selectedCategory !== null;


  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto py-8">
        <header className="relative text-center mb-12 animate-fade-in">
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-2 sm:p-4">
            <Link href="/config" title="Configuration">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 shadow-md transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                <Settings className="h-5 w-5" />
              </div>
            </Link>
            <Link href="/about" title="About Us">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-md transition-colors hover:bg-blue-600">
                <Info className="h-5 w-5" />
              </div>
            </Link>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4 tracking-tight">
            Dev Toolkit
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your one-stop collection of essential online utilities for developers, designers, and anyone needing a quick tool.
          </p>
        </header>

        <section className="mb-12">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search for any tool..."
              className="w-full p-4 pl-12 text-lg border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          {/* Desktop View: Inline buttons */}
          <div className="hidden sm:flex flex-wrap justify-center gap-2 sm:gap-3 min-h-[44px]">
            {dynamicFilterCategories.length > 1 && dynamicFilterCategories.map(cat => {
              const isSelected = selectedCategory === cat.name;
              const colorClasses = CATEGORY_COLORS[cat.name] || CATEGORY_COLORS['All'];
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${isSelected ? `${colorClasses} shadow-md` : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>

          {/* Mobile View: "Filter" button */}
          <div className="sm:hidden flex justify-center">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 border
                ${selectedCategory
                  ? `${CATEGORY_COLORS[selectedCategory] || CATEGORY_COLORS['All']} border-transparent shadow-md`
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'}`
              }
            >
              <Settings className="h-4 w-4" />
              <span>Filters {selectedCategory && selectedCategory !== 'All' ? `(${selectedCategory})` : ''}</span>
            </button>
          </div>
        </section>

        {/* Filter Modal for Mobile */}
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFilterModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} >
          {/* This div will handle the instant blur and opacity transition for the overlay */}
          <div className={`absolute inset-0 bg-black/20 ${isFilterModalOpen ? 'backdrop-blur-sm' : ''}`} onClick={() => setIsFilterModalOpen(false)}></div>
          <div
            className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 w-11/12 max-w-md border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300 ease-out
      ${isFilterModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Select a Category</h3>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {dynamicFilterCategories.map(cat => {
                const isSelected = selectedCategory === cat.name;
                const colorClasses = CATEGORY_COLORS[cat.name] || CATEGORY_COLORS['All'];
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleFilterClick(cat.name)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${isSelected ? `${colorClasses} shadow-lg` : 'bg-gray-100/80 text-gray-700 dark:bg-gray-900/60 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80'}`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {shouldShowContent ? (
          <>
            {!isFiltered && (
              <div className="flex justify-end gap-2 mb-6">
                <button onClick={() => setAllCategoriesExpanded(true)} className="px-3 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition">Expand All</button>
                <button onClick={() => setAllCategoriesExpanded(false)} className="px-3 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition">Collapse All</button>
              </div>
            )}
            {isFiltered ? (
              <>
                {filteredUtilities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredUtilities.map(util => (<UtilityCard key={util.name} util={util} />))}
                  </div>
                ) : (
                  <div className="text-center py-10"><p className="text-gray-600 dark:text-gray-400 text-lg">No utilities found matching your criteria.</p></div>
                )}
              </>
            ) : (
              <div className="space-y-8">
                {sortedCategories.map((category) => {
                  const utils = groupedUtilities[category];
                  if (!utils || utils.length === 0) return null;
                  return (
                    <section key={category}>
                      <button onClick={() => toggleCategory(category)} className="w-full flex justify-between items-center text-left text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b-2 border-blue-500 dark:border-blue-400">
                        <span>{category}</span>
                        {expandedCategories[category] ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                      </button>
                      <div className={`grid overflow-hidden transition-all duration-500 ease-in-out ${expandedCategories[category] ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="min-h-0 col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {utils.map(util => (<UtilityCard key={util.name} util={util} />))}
                        </div>
                      </div>
                    </section>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Select a category or use the search bar to find a tool.
            </p>
          </div>
        )}
      </div>

      {showScrollToTop && (
        <button onClick={scrollToTop} className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg" aria-label="Scroll to top" title="Scroll to top">
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </main>
  );
}