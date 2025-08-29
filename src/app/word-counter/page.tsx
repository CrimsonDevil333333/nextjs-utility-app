'use client';

import { useState, useCallback, useMemo } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, X } from 'lucide-react';

// --- Reusable Components ---

function CopyButton({ valueToCopy, ariaLabel }: { valueToCopy: string; ariaLabel: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (valueToCopy) {
      try {
        await navigator.clipboard.writeText(valueToCopy);
        setCopied(true);
        triggerHapticFeedback();
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  }, [valueToCopy]);

  const isValueEmpty = !valueToCopy;

  return (
    <button
      onClick={handleCopy}
      disabled={isValueEmpty}
      className={`p-2 rounded-md transition-all duration-200 ease-in-out ${isValueEmpty ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

export default function WordCounterPage() {
  const [text, setText] = useState('Type or paste your text here to count words, characters, and lines.');

  const counts = useMemo(() => {
    const charCount = text.length;
    const charNoSpacesCount = text.replace(/\s/g, '').length;

    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    const lines = text.split(/\r\n|\r|\n/);
    const lineCount = lines.length;

    const readingTime = Math.ceil(wordCount / 200); // Average reading speed of 200 WPM
    const longestWord = words.reduce((longest, current) => current.length > longest.length ? current : longest, "");

    return {
      charCount,
      charNoSpacesCount,
      wordCount,
      lineCount,
      readingTime,
      longestWord,
    };
  }, [text]);

  const handleClear = useCallback(() => {
    triggerHapticFeedback();
    setText('');
  }, []);

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Word, Character, & Line Counter</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Analyze your text's statistics in real-time.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter your text below:
            </label>
            <div className="relative">
              <textarea
                id="text-input"
                value={text}
                onFocus={triggerHapticFeedback}
                onChange={(e) => { setText(e.target.value); triggerHapticFeedback(); }}
                placeholder="Start typing or paste text here..."
                rows={10}
                className="w-full p-3 font-sans text-base border rounded-lg resize-y bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <CopyButton valueToCopy={text} ariaLabel="Copy Text" />
                <button onClick={handleClear} className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md" title="Clear Text" disabled={!text.trim()}><X size={16} /></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-md">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{counts.wordCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Words</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-md">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{counts.charCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Characters</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-md">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{counts.charNoSpacesCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Characters (no spaces)</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-md">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{counts.lineCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Lines</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-md">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">~{counts.readingTime} min</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Reading Time</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-md">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 truncate">{counts.longestWord}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Longest Word</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
