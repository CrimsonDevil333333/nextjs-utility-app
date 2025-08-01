'use client';

import { useState, useMemo, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

// Reusable CopyButton component
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
      className={`
                px-3 py-1.5 text-sm font-medium rounded-md
                flex items-center space-x-1
                transition-all duration-200 ease-in-out
                ${isValueEmpty
          ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
        }
            `}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {copied ? (
        <span>Copied!</span>
      ) : (
        <span>Copy</span>
      )}
    </button>
  );
}


export default function JsonFormatterPage() {
  const [input, setInput] = useState('{"hello": "world", "nested": [1,2,3], "number": 123, "boolean": true, "null": null}');

  const { formatted, error } = useMemo(() => {
    if (!input.trim()) return { formatted: '', error: null };
    try {
      const parsed = JSON.parse(input);
      return { formatted: JSON.stringify(parsed, null, 2), error: null };
    } catch (e: any) {
      return { formatted: '', error: e.message };
    }
  }, [input]);

  const handleClearInput = useCallback(() => {
    triggerHapticFeedback();
    setInput('');
  }, []);

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">JSON Formatter & Validator</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Format, validate, and beautify your JSON data with ease.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="json-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Input JSON
              </label>
              <div className="relative">
                <textarea
                  id="json-input"
                  value={input}
                  onFocus={triggerHapticFeedback}
                  onChange={(e) => { setInput(e.target.value); triggerHapticFeedback(); }}
                  placeholder="Paste your JSON here..."
                  rows={15}
                  className={`w-full h-96 p-3 font-mono text-sm border rounded-lg resize-y bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${error ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                />
                {input && (
                  <button
                    onClick={handleClearInput}
                    className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md"
                    title="Clear Input"
                  >
                    Clear
                  </button>
                )}
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2">
                  <strong>Error:</strong> {error}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="json-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Formatted JSON
              </label>
              <div className="relative">
                <textarea
                  id="json-output"
                  readOnly
                  value={formatted}
                  placeholder="Formatted JSON will appear here..."
                  rows={15}
                  className="w-full h-96 p-3 font-mono text-sm border rounded-lg resize-y bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default"
                />
                <div className="absolute top-3 right-3">
                  <CopyButton valueToCopy={formatted} ariaLabel="Copy formatted JSON" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
