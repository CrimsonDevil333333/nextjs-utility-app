'use client';

import Link from 'next/link';
import { Info } from 'lucide-react';
import { useState, useMemo, useEffect, useCallback } from 'react';

const utilities = [
  { name: 'Metric Converter', href: '/metric-converter', description: 'Convert length, weight, and volume.', emoji: '📏', category: 'Converters' },
  { name: 'JWT Decoder', href: '/jwt-decoder', description: 'Decode and inspect JWT tokens.', emoji: '🔐', category: 'Developers' },
  { name: 'Currency Converter', href: '/currency-converter', description: 'Real-time exchange rates.', emoji: '💸', category: 'Finance' },
  { name: 'Base64 Converter', href: '/base64-converter', description: 'Encode and decode Base64 text.', emoji: '📰', category: 'Converters' },
  { name: 'Hash Generator', href: '/hash-generator', description: 'Generate SHA-256/512 hashes.', emoji: '🛡️', category: 'Security' },
  { name: 'Color Converter', href: '/color-converter', description: 'Convert HEX, RGB, and HSL colors.', emoji: '🎨', category: 'Design' },
  { name: 'URL Encoder', href: '/url-encoder', description: 'Encode & decode URL components.', emoji: '🔗', category: 'Developers' },
  { name: 'JSON Formatter', href: '/json-formatter', description: 'Beautify and validate JSON data.', emoji: '📑', category: 'Developers' },
  { name: 'UUID Generator', href: '/uuid-generator', description: 'Generate universally unique IDs.', emoji: '🆔', category: 'Developers' },
  { name: 'Lorem Ipsum', href: '/lorem-ipsum', description: 'Generate placeholder text.', emoji: '✍️', category: 'Text' },
  { name: 'Text Case Converter', href: '/text-case-converter', description: 'Convert text between various casing conventions.', emoji: '🔡', category: 'Text' },
  { name: 'Epoch Converter', href: '/epoch-converter', description: 'Convert Unix timestamps to human-readable dates.', emoji: '⏰', category: 'Time & Date' },
  { name: 'CSV & JSON Converter', href: '/csv-json-converter', description: 'Transform data between CSV and JSON formats.', emoji: '🔄', category: 'Converters' },
  { name: 'Word Counter', href: '/word-counter', description: 'Count words, characters, and lines in text.', emoji: '📊', category: 'Text' },
  { name: 'Percentage Calculator', href: '/percentage-calculator', description: 'Calculate various percentages.', emoji: '🔢', category: 'Math' },
  { name: 'Date Calculator', href: '/date-difference', description: 'Calculate date differences or add/subtract from dates.', emoji: '🗓️', category: 'Time & Date' },
  { name: 'Random Generator', href: '/random-generator', description: 'Generate random numbers or secure passwords.', emoji: '🎲', category: 'Tools' },
  { name: 'XML Formatter', href: '/xml-formatter', description: 'Beautify and view XML data.', emoji: '📁', category: 'Developers' },
  { name: 'URL Parser/Builder', href: '/url-parser', description: 'Deconstruct or construct URLs.', emoji: '🌐', category: 'Developers' },
  { name: 'CRON Generator/Parser', href: '/cron-generator', description: 'Create and understand CRON job expressions.', emoji: '🕰️', category: 'Developers' },
  { name: 'HTML Entities', href: '/html-entities', description: 'Encode/decode HTML special characters.', emoji: '↔️', category: 'Text' },
  { name: 'Find & Replace', href: '/find-replace', description: 'Search and replace text with options.', emoji: '🔍', category: 'Text' },
  { name: 'Text Diff Checker', href: '/text-diff', description: 'Compare two texts and highlight differences.', emoji: '🔀', category: 'Text' },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(utilities.map(util => util.category));
    return ['All', ...Array.from(uniqueCategories).sort()];
  }, []);

  const filteredUtilities = useMemo(() => {
    let filtered = utilities;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(util => util.category === selectedCategory);
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(util =>
        util.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        util.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        util.category.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  const handleScroll = useCallback(() => {
    setShowScrollToTop(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header with top-right Learn About Us link */}
        <header className="relative text-center mb-12 animate-fade-in">
          {/* Full text button on sm and up, icon-only on mobile */}
          <Link
            href="/about"
            className="absolute top-0 right-0 mt-2 mr-2 sm:mt-4 sm:mr-4 transition-colors duration-200 z-10"
            title="About Us"
          >
            {/* Icon-only button for mobile */}
            <div className="sm:hidden w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600">
              <Info className="w-5 h-5" />
            </div>

            {/* Full button for sm and up */}
            <div className="hidden sm:inline-block px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 font-medium text-sm">
              Learn About Us
            </div>
          </Link>

          <h1 className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4 tracking-tight">
            Dev Toolkit
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your one-stop collection of essential online utilities for developers, designers, and anyone needing a quick tool. From converters to generators, we&apos;ve got you covered!
          </p>
        </header>


        {/* Filter Toggle */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors flex items-center justify-center mx-auto text-sm"
            aria-expanded={showCategoryFilter}
            aria-controls="filter-section"
          >
            {showCategoryFilter ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                Hide Filters
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                Show Filters
              </>
            )}
          </button>
        </div>

        {/* Filters */}
        {showCategoryFilter && (
          <section id="filter-section" className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-slide-down">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="search-utilities" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Utilities:</label>
                <div className="relative">
                  <input
                    type="text"
                    id="search-utilities"
                    placeholder="e.g. JSON, Base64..."
                    className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Category:</label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                Clear All
              </button>
            </div>
          </section>
        )}

        {/* Utilities Grid */}
        {filteredUtilities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUtilities.map(util => (
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
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No utilities found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 z-50"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
        </button>
      )}
    </main>
  );
}
