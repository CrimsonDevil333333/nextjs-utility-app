'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
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
                flex items-center space-x-2
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

type Mode = 'timestampToDate' | 'dateToTimestamp';

export default function EpochConverterPage() {
  const [input, setInput] = useState<string>('');
  const [mode, setMode] = useState<Mode>('timestampToDate');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'timestampToDate') {
      setInput(String(Math.floor(Date.now() / 1000)));
    } else {
      const now = new Date();
      setInput(now.toISOString().slice(0, 16));
    }
  }, [mode]);

  const convertedOutput = useMemo(() => {
    setError(null);
    if (!input.trim()) return '';

    if (mode === 'timestampToDate') {
      const timestamp = parseInt(input, 10);
      if (isNaN(timestamp) || timestamp < 0) {
        setError('Invalid timestamp. Please enter a positive number.');
        return '';
      }
      const date = new Date(timestamp * 1000);
      if (isNaN(date.getTime())) {
        setError('Invalid timestamp conversion.');
        return '';
      }
      return date.toLocaleString('en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZoneName: 'shortOffset'
      });
    } else {
      try {
        const date = new Date(input);
        if (isNaN(date.getTime())) {
          setError('Invalid date format. Please use YYYY-MM-DDTHH:MM.');
          return '';
        }
        return String(Math.floor(date.getTime() / 1000));
      } catch (e: any) {
        setError('Failed to parse date. ' + e.message);
        return '';
      }
    }
  }, [input, mode]);

  const handleClear = useCallback(() => {
    triggerHapticFeedback();
    setInput('');
    setError(null);
  }, []);

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Epoch & Unix Timestamp Converter</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Convert timestamps to human-readable dates and vice-versa.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
              <button
                onClick={() => { setMode('timestampToDate'); triggerHapticFeedback(); }}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ease-in-out ${mode === 'timestampToDate' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow' : 'text-gray-600 dark:text-gray-300'}`}
              >
                Timestamp to Date
              </button>
              <button
                onClick={() => { setMode('dateToTimestamp'); triggerHapticFeedback(); }}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ease-in-out ${mode === 'dateToTimestamp' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow' : 'text-gray-600 dark:text-gray-300'}`}
              >
                Date to Timestamp
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="input-field" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {mode === 'timestampToDate' ? 'Enter Unix Timestamp (seconds)' : 'Enter Date and Time'}
              </label>
              <div className="relative">
                <input
                  id="input-field"
                  type={mode === 'timestampToDate' ? 'number' : 'datetime-local'}
                  value={input}
                  onFocus={triggerHapticFeedback}
                  onChange={(e) => { setInput(e.target.value); triggerHapticFeedback(); }}
                  placeholder={mode === 'timestampToDate' ? 'e.g., 1678886400' : ''}
                  className={`w-full p-3 font-mono text-base border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${error ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                />
                {input && (
                  <button
                    onClick={handleClear}
                    className="absolute top-1/2 -translate-y-1/2 right-3 px-2 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md"
                    title="Clear Input"
                  >
                    Clear
                  </button>
                )}
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <div>
              <label htmlFor="output-field" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {mode === 'timestampToDate' ? 'Converted Date (Local Time)' : 'Converted Unix Timestamp'}
              </label>
              <div className="relative">
                <input
                  id="output-field"
                  readOnly
                  value={convertedOutput}
                  placeholder="Result..."
                  className="w-full p-3 font-mono text-base border rounded-lg bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default"
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-2">
                  <CopyButton valueToCopy={convertedOutput} ariaLabel="Copy converted value" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
