'use client';

import { useState, useMemo, useCallback } from 'react';

// Reusable CopyButton component (consider moving this to a shared components file)
function CopyButton({ valueToCopy, ariaLabel }: { valueToCopy: string; ariaLabel: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        if (valueToCopy) {
            try {
                await navigator.clipboard.writeText(valueToCopy);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                // Optionally, provide user feedback for failed copy
            }
        }
    }, [valueToCopy]);

    // Determine if the value is empty or an error state from the main component
    const isValueEmptyOrError = !valueToCopy || valueToCopy.startsWith('Error:');

    return (
        <button
            onClick={handleCopy}
            disabled={isValueEmptyOrError}
            className={`
                px-3 py-1.5 text-sm font-medium rounded-md
                flex items-center space-x-1
                transition-all duration-200 ease-in-out
                ${isValueEmptyOrError
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                }
            `}
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            {copied ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Copy</span>
                </>
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
    setInput('');
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">JSON Formatter & Validator</h1>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"> {/* Added panel styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Increased gap */}
          {/* Input Textarea */}
          <div>
            <label htmlFor="json-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input JSON
            </label>
            <div className="relative"> {/* For clear button positioning */}
              <textarea
                id="json-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Paste your JSON here..."
                rows={15} // Increased default rows for better visibility
                className={`
                  w-full h-96 p-2.5 font-mono text-sm border rounded-lg resize-y /* Consistent padding & resize */
                  bg-gray-50 dark:bg-gray-700 dark:border-gray-600
                  text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all duration-200 ease-in-out
                  ${error ? 'border-red-500 ring-red-500' : ''} /* Error ring */
                `}
              />
              <button
                onClick={handleClearInput}
                className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                aria-label="Clear input"
                title="Clear Input"
                disabled={!input.trim()}
              >
                Clear
              </button>
            </div>
            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                <strong>Error:</strong> {error}
              </p>
            )}
          </div>

          {/* Formatted Output Textarea */}
          <div>
            <label htmlFor="json-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Formatted JSON
            </label>
            <div className="relative"> {/* For copy button positioning */}
              <textarea
                id="json-output"
                readOnly
                value={formatted}
                placeholder="Formatted JSON will appear here..."
                rows={15} // Consistent rows with input
                className={`
                  w-full h-96 p-2.5 font-mono text-sm border rounded-lg resize-y
                  bg-gray-100 dark:bg-gray-900 dark:border-gray-700
                  text-gray-800 dark:text-gray-200
                  cursor-default /* Indicates it's not editable */
                  focus:outline-none /* Remove focus outline for readOnly */
                  ${error ? 'border-red-500 ring-red-500' : ''} /* Red border if input has error */
                `}
              />
              <CopyButton valueToCopy={formatted} ariaLabel="Copy formatted JSON" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}