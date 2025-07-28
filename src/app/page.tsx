'use client';

import Link from 'next/link';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { utilities, Utility } from '@/app/data/utilities';

// Sub-component for individual utility cards for cleaner code
function UtilityCard({ util }: { util: Utility }) {
  return (
    <Link href={util.href} key={util.name} className="group block h-full animate-card-fade-in">
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

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // ADDED: State to manage which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => {
    const uniqueCategories = new Set(utilities.map(util => util.category));
    return ['All', ...Array.from(uniqueCategories).sort()];
  }, []);

  // ADDED: Effect to initialize all categories as expanded by default
  useEffect(() => {
    const initialExpansionState = categories.slice(1).reduce((acc, category) => {
      acc[category] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedCategories(initialExpansionState);
  }, [categories]);

  const groupedUtilities = useMemo(() => {
    return categories.slice(1).reduce((acc, category) => {
      acc[category] = utilities.filter(util => util.category === category);
      return acc;
    }, {} as Record<string, Utility[]>);
  }, [categories]);

  const filteredUtilities = useMemo(() => {
    if (searchTerm === '' && selectedCategory === 'All') return [];
    return utilities.filter(util => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const categoryMatch = selectedCategory === 'All' || util.category === selectedCategory;
      const searchMatch = !searchTerm ||
        util.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        util.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        util.category.toLowerCase().includes(lowerCaseSearchTerm);
      return categoryMatch && searchMatch;
    });
  }, [searchTerm, selectedCategory]);
  
  const handleScroll = useCallback(() => {
    setShowScrollToTop(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // ADDED: Handlers for expand/collapse functionality
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const setAllCategoriesExpanded = (isExpanded: boolean) => {
    const newState = Object.keys(expandedCategories).reduce((acc, key) => {
      acc[key] = isExpanded;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedCategories(newState);
  };

  const isFiltered = searchTerm !== '' || selectedCategory !== 'All';

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto py-8">
        {/* UNCHANGED: Header with top-right Learn About Us link */}
        <header className="relative text-center mb-12 animate-fade-in">
          <Link href="/about" className="absolute top-0 right-0 mt-2 mr-2 sm:mt-4 sm:mr-4 transition-colors duration-200 z-10" title="About Us">
            <div className="sm:hidden w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600">
              <Info className="w-5 h-5" />
            </div>
            <div className="hidden sm:inline-block px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 font-medium text-sm">
              Learn About Us
            </div>
          </Link>
          <h1 className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4 tracking-tight">
            Dev Toolkit
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your one-stop collection of essential online utilities for developers, designers, and anyone needing a quick tool.
          </p>
        </header>

        {/* UNCHANGED: Filter Toggle */}
        <div className="text-center mb-6">
          <button onClick={() => setShowCategoryFilter(!showCategoryFilter)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors flex items-center justify-center mx-auto text-sm" aria-expanded={showCategoryFilter} aria-controls="filter-section">
            {showCategoryFilter ? (
              <><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg> Hide Filters</>
            ) : (
              <><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg> Show Filters</>
            )}
          </button>
        </div>

        {/* UNCHANGED: Filters Section */}
        {showCategoryFilter && (
          <section id="filter-section" className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-slide-down">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="search-utilities" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Utilities:</label>
                <div className="relative">
                  <input type="text" id="search-utilities" placeholder="e.g. JSON, Base64..." className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Category:</label>
                <select id="category-filter" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                  {categories.map((category) => (<option key={category} value={category}>{category}</option>))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-right">
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                Clear All
              </button>
            </div>
          </section>
        )}

        {/* ADDED: Expand/Collapse All buttons for grouped view */}
        {!isFiltered && (
          <div className="flex justify-end gap-2 mb-6">
            <button onClick={() => setAllCategoriesExpanded(true)} className="px-3 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition">
              Expand All
            </button>
            <button onClick={() => setAllCategoriesExpanded(false)} className="px-3 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition">
              Collapse All
            </button>
          </div>
        )}

        {/* UPDATED: Conditional Rendering Logic */}
        {isFiltered ? (
          // UNCHANGED: Filtered View (when searching or category selected)
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
          // UPDATED: Default Grouped View with expand/collapse
          <div className="space-y-8">
            {Object.entries(groupedUtilities).map(([category, utils]) => (
              <section key={category}>
                <button onClick={() => toggleCategory(category)} className="w-full flex justify-between items-center text-left text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b-2 border-blue-500 dark:border-blue-400">
                  <span>{category}</span>
                  {expandedCategories[category] ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </button>
                <div className={`grid overflow-hidden transition-all duration-500 ease-in-out ${ expandedCategories[category] ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0' }`}>
                  <div className="min-h-0 col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {utils.map(util => (<UtilityCard key={util.name} util={util} />))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
      
      {/* UNCHANGED: Scroll to Top Button */}
      {showScrollToTop && (
        <button onClick={scrollToTop} className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 z-50" aria-label="Scroll to top" title="Scroll to top">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
        </button>
      )}
    </main>
  );
}