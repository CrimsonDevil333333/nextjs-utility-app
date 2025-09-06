'use client';

import Link from 'next/link';
import { Info, ChevronDown, ChevronUp, ArrowUp, Settings, X, Search, LayoutGrid, List, Shuffle, Clock } from 'lucide-react';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { utilities, Utility } from '@/app/data/utilities';
import { triggerHapticFeedback } from '@/utils/haptics';
import { AnimatePresence, motion } from 'framer-motion';

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

// --- Sub-components for better structure ---

const UtilityCard = ({ util }: { util: Utility }) => {
  const handleCardClick = useCallback(() => {
    triggerHapticFeedback();
    try {
      const stored = localStorage.getItem('recentlyUsedTools');
      let recent: Utility[] = stored ? JSON.parse(stored) : [];
      recent = recent.filter(u => u.href !== util.href);
      recent.unshift(util);
      localStorage.setItem('recentlyUsedTools', JSON.stringify(recent.slice(0, 4)));
    } catch (e) {
      console.error("Failed to update recently used tools:", e);
    }
  }, [util]);

  return (
    <Link href={util.href} key={util.name} className="group block h-full animate-card-fade-in" onClick={handleCardClick}>
      <div className="p-6 bg-white/80 dark:bg-gray-800/50 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out border border-gray-200/80 dark:border-gray-700/50 h-full flex flex-col justify-between">
        <div>
          <span className="text-4xl mb-4 block transform group-hover:scale-110 transition-transform duration-300 ease-in-out">{util.emoji}</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{util.name}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{util.description}</p>
        </div>
        <div className="mt-4 text-blue-600 dark:text-blue-400 flex items-center group-hover:gap-2 transition-all duration-200 text-sm font-medium">
          Go to tool
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </Link>
  );
};

const LayoutSwitcher = ({ currentLayout, onLayoutChange }: { currentLayout: 'minimal' | 'classic', onLayoutChange: (layout: 'minimal' | 'classic') => void }) => (
  <div className="flex items-center gap-1 p-1 rounded-full bg-gray-200 dark:bg-gray-900">
    <button onClick={() => onLayoutChange('minimal')} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-all ${currentLayout === 'minimal' ? 'bg-white dark:bg-gray-700 shadow' : 'text-gray-600 dark:text-gray-400'}`}>
      <LayoutGrid size={16} /> Minimal
    </button>
    <button onClick={() => onLayoutChange('classic')} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-all ${currentLayout === 'classic' ? 'bg-white dark:bg-gray-700 shadow' : 'text-gray-600 dark:text-gray-400'}`}>
      <List size={16} /> Classic
    </button>
  </div>
);

const WelcomeBanner = ({ onDismiss, isMobile }: { onDismiss: () => void; isMobile: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="relative bg-blue-500 text-white p-4 rounded-lg mb-8 shadow-lg"
  >
    <p className="pr-8">
      {isMobile
        ? 'Welcome! Try the "Classic Layout" for a full overview of all tools.'
        : <>Welcome! Try the new <strong className="font-semibold">Classic Layout</strong> for a full overview, or use the <strong className="font-semibold">/</strong> key to start a search.</>
      }
    </p>
    <button onClick={onDismiss} className="absolute top-2 right-2 p-2 rounded-full hover:bg-white/20 transition-colors">
      <X size={18} />
    </button>
  </motion.div>
);

const CATEGORY_COLORS: Record<string, string> = {
  'Converters': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Developers': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  'Finance': 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
  'Security': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'Design': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
  'Text': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Time & Date': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
  'Math': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Tools': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Games': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300',
  'Health': 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
  'Network': 'bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-300',
  'AI Tools': 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
  'All': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'
};

const CATEGORY_ORDER = [
  'Tools', 'Text', 'Time & Date', 'Converters', 'Math',
  'Design', 'Network', 'Security', 'Finance', 'Health',
  'Developers', 'AI Tools', 'Games'
];

// --- Main Page Component ---

export default function HomePageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => searchParams.get('category'));
  const [layoutStyle, setLayoutStyle] = useState<'minimal' | 'classic'>('minimal');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showToolCounts, setShowToolCounts] = useState(false);
  const [recentlyUsed, setRecentlyUsed] = useState<Utility[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileFilterStyle, setMobileFilterStyle] = useState<'sheet' | 'modal'>('sheet');

  const featuredTools = useMemo(() => utilities.filter(u => ['/converters/json-formatter', '/design/color-picker'].includes(u.href)), []);

  const { groupedUtilities, sortedCategories, dynamicFilterCategories } = useMemo(() => {
    const grouped = utilities.reduce((acc, util) => {
      (acc[util.category] = acc[util.category] || []).push(util);
      return acc;
    }, {} as Record<string, Utility[]>);

    const orderMap = CATEGORY_ORDER.reduce((acc, cat, index) => ({ ...acc, [cat]: index }), {} as Record<string, number>);
    const sorted = Object.keys(grouped).sort((a, b) => (orderMap[a] ?? 99) - (orderMap[b] ?? 99) || a.localeCompare(b));

    const dynamicFilters = sorted.map(category => ({
      name: category,
      emoji: grouped[category]?.[0]?.emoji || '❓',
      count: grouped[category]?.length || 0,
    }));

    return {
      groupedUtilities: grouped,
      sortedCategories: sorted,
      dynamicFilterCategories: [{ name: 'All', emoji: '🌟', count: utilities.length }, ...dynamicFilters]
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
    else params.delete('search');
    if (selectedCategory) params.set('category', selectedCategory);
    else params.delete('category');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm, selectedCategory, pathname, router]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const savedExpansionState = localStorage.getItem('expandedCategories');
    setExpandedCategories(savedExpansionState ? JSON.parse(savedExpansionState) : sortedCategories.reduce((acc, category) => ({ ...acc, [category]: true }), {}));

    const savedLayout = localStorage.getItem('homePageLayout') as 'minimal' | 'classic';
    if (savedLayout) setLayoutStyle(savedLayout);

    const savedShowCounts = localStorage.getItem('showToolCounts');
    if (savedShowCounts) setShowToolCounts(JSON.parse(savedShowCounts));

    const storedRecent = localStorage.getItem('recentlyUsedTools');
    if (storedRecent) setRecentlyUsed(JSON.parse(storedRecent));

    const welcomeDismissed = localStorage.getItem('welcomeMessageDismissed');
    if (!welcomeDismissed) setShowWelcome(true);

    const savedFilterStyle = localStorage.getItem('mobileFilterStyle') as 'sheet' | 'modal';
    if (savedFilterStyle) setMobileFilterStyle(savedFilterStyle);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sortedCategories]);

  useEffect(() => {
    if (Object.keys(expandedCategories).length > 0) {
      localStorage.setItem('expandedCategories', JSON.stringify(expandedCategories));
    }
  }, [expandedCategories]);

  const filteredUtilities = useMemo(() => {
    const term = debouncedSearchTerm.toLowerCase();
    const category = selectedCategory;
    if (!category && !term) return utilities;
    return utilities.filter(util =>
      (!category || util.category === category) &&
      (!term || util.name.toLowerCase().includes(term) || util.description.toLowerCase().includes(term) || util.category.toLowerCase().includes(term))
    );
  }, [debouncedSearchTerm, selectedCategory]);

  const handleScroll = useCallback(() => setShowScrollToTop(window.scrollY > 300), []);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleLayoutChange = (style: 'minimal' | 'classic') => {
    setLayoutStyle(style);
    localStorage.setItem('homePageLayout', style);
    triggerHapticFeedback();
  };

  const handleRandomTool = () => {
    triggerHapticFeedback();
    const randomTool = utilities[Math.floor(Math.random() * utilities.length)];
    router.push(randomTool.href);
  };

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('welcomeMessageDismissed', 'true');
  };

  const setAllCategoriesExpanded = (isExpanded: boolean) => {
    const newState = sortedCategories.reduce((acc, key) => ({ ...acc, [key]: isExpanded }), {} as Record<string, boolean>);
    setExpandedCategories(newState);
    triggerHapticFeedback();
  };

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); triggerHapticFeedback(); };
  const toggleCategory = (category: string) => { setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] })); triggerHapticFeedback(); };
  const handleFilterClick = (categoryName: string) => { setSelectedCategory(categoryName === 'All' ? null : categoryName); setIsFilterModalOpen(false); triggerHapticFeedback(); };

  const isFiltered = debouncedSearchTerm || selectedCategory;

  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
    triggerHapticFeedback();
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto py-8">
        <AnimatePresence>
          {showWelcome && <WelcomeBanner onDismiss={dismissWelcome} isMobile={isMobile} />}
        </AnimatePresence>
        <header className="relative text-center mb-12 animate-fade-in">
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-2 sm:p-0">
            <Link href="/config" title="Configuration" onClick={triggerHapticFeedback} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-md transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
              <Settings className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Link>
            <Link href="/about" title="About Us" onClick={triggerHapticFeedback} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-md transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
              <Info className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Link>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4 tracking-tight">
            Dev Toolkit
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your one-stop collection of essential online utilities.
          </p>
        </header>

        <section className="mb-8 sticky top-4 z-20 px-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for any tool..."
              className="w-full p-4 pl-14 pr-12 text-lg border-2 border-transparent rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            )}
          </div>
          <div className="flex justify-center items-center gap-2">
            <LayoutSwitcher currentLayout={layoutStyle} onLayoutChange={handleLayoutChange} />
            <button onClick={handleRandomTool} className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-900 shadow transition-transform hover:scale-110" title="Random Tool">
              <Shuffle size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </section>

        {layoutStyle === 'minimal' && (
          <section className="mb-12">
            <div className="hidden sm:flex flex-wrap justify-center gap-3 min-h-[44px]">
              {dynamicFilterCategories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => handleFilterClick(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${selectedCategory === cat.name || (cat.name === 'All' && !selectedCategory) ? `${CATEGORY_COLORS[cat.name]} shadow-md` : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name} {showToolCounts && <span className="font-normal opacity-75">{cat.count}</span>}</span>
                </button>
              ))}
            </div>
            <div className="sm:hidden flex justify-center">
              <button
                onClick={handleOpenFilterModal}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-full transition-all duration-300 border shadow-md ${CATEGORY_COLORS[selectedCategory || 'All']} border-transparent`}
              >
                <Settings className="h-4 w-4" />
                <span>Filters {selectedCategory ? `(${selectedCategory})` : ''}</span>
              </button>
            </div>
          </section>
        )}

        {!isFiltered && (
          <section className="mb-12 space-y-8">
            {featuredTools.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Featured Tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {featuredTools.map(util => <UtilityCard key={util.name} util={util} />)}
                </div>
              </div>
            )}
            {recentlyUsed.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2"><Clock size={22} /> Recently Used</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recentlyUsed.map(util => <UtilityCard key={util.name} util={util} />)}
                </div>
              </div>
            )}
          </section>
        )}

        <div>
          {layoutStyle === 'classic' && !isFiltered ? (
            <div className="space-y-12">
              <div className="flex justify-end gap-2">
                <button onClick={() => setAllCategoriesExpanded(true)} className="px-3 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition">Expand All</button>
                <button onClick={() => setAllCategoriesExpanded(false)} className="px-3 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition">Collapse All</button>
              </div>
              {sortedCategories.map((category) => {
                const utilsInCategory = groupedUtilities[category];
                return (
                  <section key={category}>
                    <button onClick={() => toggleCategory(category)} className="w-full flex justify-between items-center text-left text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b-2 border-gray-300 dark:border-gray-700">
                      <span>{category} {showToolCounts && <span className="text-lg font-normal text-gray-500 dark:text-gray-400">({utilsInCategory.length})</span>}</span>
                      <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${expandedCategories[category] ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`grid overflow-hidden transition-all duration-500 ease-in-out ${expandedCategories[category] ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="min-h-0 col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {utilsInCategory.map(util => (<UtilityCard key={util.name} util={util} />))}
                      </div>
                    </div>
                  </section>
                )
              })}
            </div>
          ) : (
            <>
              {filteredUtilities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredUtilities.map(util => (<UtilityCard key={util.name} util={util} />))}
                </div>
              ) : (
                <div className="text-center py-10"><p className="text-gray-600 dark:text-gray-400 text-lg">No utilities found.</p></div>
              )}
            </>
          )}
        </div>
      </div>

      {layoutStyle === 'minimal' && (
        <AnimatePresence>
          {isFilterModalOpen && (
            <>
              {mobileFilterStyle === 'sheet' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setIsFilterModalOpen(false)}>
                  <motion.div
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 300 }}
                    dragElastic={{ top: 0, bottom: 0.5 }}
                    onDragEnd={(event, info) => {
                      if (info.offset.y > 150) {
                        setIsFilterModalOpen(false);
                        triggerHapticFeedback();
                      }
                    }}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: 'spring', damping: 50, stiffness: 500 }}
                    className="absolute bottom-0 left-0 right-0 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-t-2xl shadow-2xl p-4 max-h-[80dvh] overflow-y-auto cursor-grab active:cursor-grabbing"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-6">Select a Category</h3>
                    <div className="flex flex-wrap justify-center gap-3 pb-4">
                      {dynamicFilterCategories.map(cat => (
                        <button
                          key={cat.name}
                          onClick={() => handleFilterClick(cat.name)}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${selectedCategory === cat.name || (cat.name === 'All' && !selectedCategory) ? `${CATEGORY_COLORS[cat.name]} shadow-lg` : 'bg-white/80 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300'}`}
                        >
                          <span>{cat.emoji}</span>
                          <span>{cat.name} {showToolCounts && <span className="font-normal opacity-75">{cat.count}</span>}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="fixed inset-0 z-50 flex items-center justify-center" >
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => { setIsFilterModalOpen(false); triggerHapticFeedback(); }}></div>
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 w-11/12 max-w-md border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Select a Category</h3>
                      <button onClick={() => { setIsFilterModalOpen(false); triggerHapticFeedback(); }} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {dynamicFilterCategories.map(cat => {
                        const isSelected = selectedCategory === cat.name || (cat.name === 'All' && !selectedCategory);
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
              )}
            </>
          )}
        </AnimatePresence>
      )}

      {showScrollToTop && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-opacity animate-fade-in" aria-label="Scroll to top" title="Scroll to top">
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </main>
  );
}