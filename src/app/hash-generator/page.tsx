'use client';

import { useState, useEffect, useCallback } from 'react'; // Import useCallback

// Helper to compute hash
async function computeHash(text: string, algorithm: 'SHA-256' | 'SHA-512'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  try {
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    console.error(`Error computing ${algorithm} hash:`, e);
    // Return a specific error string or null/undefined to indicate failure
    return `Error computing ${algorithm} hash.`;
  }
}

export default function HashGeneratorPage() {
  const [input, setInput] = useState('Hello World');
  const [sha256, setSha256] = useState('');
  const [sha512, setSha512] = useState('');
  const [isLoading256, setIsLoading256] = useState(false); // New loading states
  const [isLoading512, setIsLoading512] = useState(false);

  useEffect(() => {
    if (input) {
      // Set loading states immediately
      setIsLoading256(true);
      setIsLoading512(true);

      computeHash(input, 'SHA-256').then(hash => {
        setSha256(hash);
        setIsLoading256(false);
      });
      computeHash(input, 'SHA-512').then(hash => {
        setSha512(hash);
        setIsLoading512(false);
      });
    } else {
      setSha256('');
      setSha512('');
      setIsLoading256(false); // No loading if input is empty
      setIsLoading512(false);
    }
  }, [input]);
  
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Hash Generator</h1>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 space-y-6"> {/* Added panel styling */}
        <div>
          <label htmlFor="hash-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input Text</label> {/* Consistent label styling */}
          <textarea
            id="hash-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={6}
            placeholder="Type or paste text here..."
            className="
              w-full p-3 font-mono text-sm border rounded-lg resize-y /* Added resize-y */
              bg-gray-50 dark:bg-gray-700 dark:border-gray-600 /* Consistent bg and border */
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 /* Consistent focus */
              dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all duration-200 ease-in-out
            "
          />
        </div>
        <div className="space-y-4">
          <HashOutput label="SHA-256" value={isLoading256 ? 'Computing...' : sha256} algorithm="SHA-256" /> {/* Pass loading state */}
          <HashOutput label="SHA-512" value={isLoading512 ? 'Computing...' : sha512} algorithm="SHA-512" /> {/* Pass loading state */}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">* Hashes are computed securely using the browser's native Web Crypto API.</p> {/* Minor text change, center align */}
      </div>
    </div>
  );
}

// Small component for displaying hash results with a copy button
function HashOutput({ label, value, algorithm }: { label: string; value: string; algorithm: 'SHA-256' | 'SHA-512' }) { // Added algorithm prop
  const [copied, setCopied] = useState(false);

  // Determine if the current value is an error or loading message
  const isErrorOrLoading = value.startsWith('Error:') || value === 'Computing...';

  const handleCopy = useCallback(() => {
    if (!isErrorOrLoading && value) { // Only copy if not loading/error and value exists
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [value, isErrorOrLoading]);

  // Determine placeholder text based on mode
  const placeholderText = value === '' && !isErrorOrLoading ? 'Hash will appear here...' : value;


  return (
    <div>
      <h3 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</h3> {/* Consistent label styling */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={placeholderText} // Use placeholderText for value display
          className={`
            w-full p-2 font-mono text-xs border rounded
            bg-gray-100 dark:bg-gray-900 dark:border-gray-700
            text-gray-800 dark:text-gray-200
            cursor-default /* Indicate read-only */
            ${isErrorOrLoading ? 'text-red-600 dark:text-red-400 font-semibold' : ''} /* Error/loading styling */
          `}
        />
        <button
          onClick={handleCopy}
          disabled={isErrorOrLoading || !value} // Disable if loading, error, or empty
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md
            flex items-center space-x-1
            transition-all duration-200 ease-in-out
            ${isErrorOrLoading || !value
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
            }
          `}
          aria-label={`Copy ${label} hash`} // Added ARIA label
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
      </div>
      {/* Optional: Display specific error message below the input if needed */}
      {value.startsWith('Error:') && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-2">
          {value.replace('Error: ', '')}
        </p>
      )}
    </div>
  );
}