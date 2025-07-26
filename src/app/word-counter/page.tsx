// app/word-counter/page.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';


export default function WordCounterPage() {
  const [text, setText] = useState('Type or paste your text here to count words, characters, and lines.');

  const counts = useMemo(() => {
    const charCount = text.length;
    const charNoSpacesCount = text.replace(/\s/g, '').length;
    
    // Split by whitespace to count words
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Split by newline characters to count lines
    const lines = text.split(/\r\n|\r|\n/).filter(line => line.trim().length > 0); // Trimmed lines
    const lineCount = lines.length;

    return {
      charCount,
      charNoSpacesCount,
      wordCount,
      lineCount,
    };
  }, [text]);

  const handleClear = useCallback(() => {
    setText('');
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Word, Character, & Line Counter</h1>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter your text below:
          </label>
          <div className="relative">
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste text here..."
              rows={10}
              className="w-full p-2.5 font-sans text-base border rounded-lg resize-y bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
            />
            <button
              onClick={handleClear}
              className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
              aria-label="Clear input"
              title="Clear Input"
              disabled={!text.trim()}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{counts.wordCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Words</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{counts.charCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Characters (with spaces)</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{counts.charNoSpacesCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Characters (no spaces)</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{counts.lineCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Lines</p>
          </div>
        </div>
      </div>
    </div>
  );
}