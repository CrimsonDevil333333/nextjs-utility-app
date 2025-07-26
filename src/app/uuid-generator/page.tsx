'use client';

import { useState, useEffect, useCallback } from 'react';

// Reusable CopyButton component (assuming this is shared or re-defined here)
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
            }
        }
    }, [valueToCopy]);

    const isValueEmpty = !valueToCopy;

    return (
        <button
            onClick={handleCopy}
            disabled={isValueEmpty}
            className={`
                px-4 py-2 text-sm font-medium rounded-md
                flex items-center space-x-2 /* Increased space between icon and text */
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

export default function UuidGeneratorPage() {
  const [uuid, setUuid] = useState('');

  const generateUuid = useCallback(() => {
    setUuid(crypto.randomUUID());
  }, []);

  useEffect(() => {
    generateUuid(); // Generate one on initial load
  }, [generateUuid]); // Depend on generateUuid to prevent re-creation

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-8 text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">UUID Generator</h1>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <p 
          className="font-mono text-xl md:text-2xl break-all p-4 mb-6 border rounded-md /* Increased font size and padding */
                     bg-gray-100 dark:bg-gray-900 dark:border-gray-700 /* Consistent read-only styling */
                     text-gray-800 dark:text-gray-200 cursor-text select-all /* Allow text selection */"
        >
          {uuid}
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={generateUuid} 
            className="px-5 py-2 text-base font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center space-x-2"
            title="Generate a new UUID"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 14c0 1.57.81 3.013 2.112 4M6.88 20.32c1.378.536 2.9.82 4.54.82 5.093 0 9.2-4.107 9.2-9.2 0-.256-.007-.512-.02-.767m-6.855-4.502h5m-5 0V7m0 0H7m8 0a2 2 0 100 4m0-4zm0 4a2 2 0 100 4m0-4z" />
            </svg>
            <span>Generate New</span>
          </button>
          
          <CopyButton valueToCopy={uuid} ariaLabel="Copy UUID to clipboard" />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Generates RFC 4122 version 4 (random) UUIDs.
        </p>
      </div>
    </div>
  );
}