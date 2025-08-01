'use client';

import { useState, useEffect, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Helper Functions & Components ---

/**
 * Asynchronously computes a hash for the given text using the specified algorithm.
 */
async function computeHash(text: string, algorithm: 'SHA-256' | 'SHA-512'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  try {
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    console.error(`Error computing ${algorithm} hash:`, e);
    return `Error computing ${algorithm} hash.`;
  }
}

/**
 * A component for displaying a hash result with a copy button.
 */
function HashOutput({ label, value }: { label: string; value: string; }) {
  const [copied, setCopied] = useState(false);
  const isErrorOrLoading = value.startsWith('Error:') || value === 'Computing...';

  const handleCopy = useCallback(() => {
    if (!isErrorOrLoading && value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      triggerHapticFeedback();
      setTimeout(() => setCopied(false), 2000);
    }
  }, [value, isErrorOrLoading]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          readOnly
          value={value}
          className={`w-full p-3 font-mono text-xs border rounded-lg bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default pr-24 ${isErrorOrLoading ? 'text-yellow-600 dark:text-yellow-400' : ''}`}
        />
        <div className="absolute top-1/2 -translate-y-1/2 right-2">
          <button
            onClick={handleCopy}
            disabled={isErrorOrLoading || !value}
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center space-x-1 transition-colors ${isErrorOrLoading || !value ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            {copied ? <span>Copied!</span> : <span>Copy</span>}
          </button>
        </div>
      </div>
    </div>
  );
}


// --- Main Page Component ---

export default function HashGeneratorPage() {
  const [input, setInput] = useState('Hello World');
  const [sha256, setSha256] = useState('');
  const [sha512, setSha512] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateHashes = async () => {
      if (!input) {
        setSha256('');
        setSha512('');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const [hash256, hash512] = await Promise.all([
        computeHash(input, 'SHA-256'),
        computeHash(input, 'SHA-512')
      ]);
      setSha256(hash256);
      setSha512(hash512);
      setIsLoading(false);
    };
    generateHashes();
  }, [input]);

  const handleClear = () => {
    triggerHapticFeedback();
    setInput('');
  };

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Hash Generator</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Generate SHA-256 and SHA-512 hashes from your text.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
          <div>
            <label htmlFor="hash-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input Text</label>
            <div className="relative">
              <textarea
                id="hash-input"
                value={input}
                onFocus={triggerHapticFeedback}
                onChange={(e) => { setInput(e.target.value); triggerHapticFeedback(); }}
                rows={6}
                placeholder="Type or paste text here..."
                className="w-full p-3 font-sans text-base border rounded-lg resize-y bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              {input && (
                <button
                  onClick={handleClear}
                  className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md"
                  title="Clear Input"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <HashOutput label="SHA-256" value={isLoading ? 'Computing...' : sha256} />
            <HashOutput label="SHA-512" value={isLoading ? 'Computing...' : sha512} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            * Hashes are computed securely in your browser using the Web Crypto API.
          </p>
        </div>
      </div>
    </div>
  );
}
