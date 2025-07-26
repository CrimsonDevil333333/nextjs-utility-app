'use client';

import { useState, useMemo, useCallback } from 'react';

type Mode = 'encode' | 'decode';

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


export default function UrlEncoderPage() {
  const [input, setInput] = useState('https://example.com/?query=test value');
  const [mode, setMode] = useState<Mode>('encode');

  const output = useMemo(() => {
    if (!input) return '';
    try {
      return mode === 'encode'
        ? encodeURIComponent(input)
        : decodeURIComponent(input);
    } catch (e: any) { // Catch as 'any' to access message property
      // More specific error message and indication
      if (e instanceof URIError && e.message.includes('malformed URI sequence')) {
        return 'Error: Malformed URI sequence for decoding.';
      }
      return 'Error: Invalid input for decoding.';
    }
  }, [input, mode]);

  // Determine if the output contains an error
  const isOutputError = output.startsWith('Error:');

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">URL Encoder / Decoder</h1>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"> {/* Added panel styling */}
        <div className="flex justify-center mb-6">
          <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner"> {/* Refined button group styling */}
            <button
              onClick={() => setMode('encode')}
              className={`
                px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                ${mode === 'encode'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              Encode
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`
                px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                ${mode === 'decode'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              Decode
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Increased gap for better spacing */}
          {/* Input Textarea */}
          <div>
            <label htmlFor="input-textarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input Text
            </label>
            <textarea
              id="input-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter text or URL component to encode...' : 'Enter URL component to decode...'}
              rows={10} // Added rows for better initial sizing
              className="
                w-full p-2.5 font-mono text-sm border rounded-lg resize-y /* Added resize-y */
                bg-gray-50 dark:bg-gray-700 dark:border-gray-600
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all duration-200 ease-in-out
              "
            />
          </div>

          {/* Output Textarea */}
          <div>
            <label htmlFor="output-textarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Result
            </label>
            <div className="relative"> {/* Wrapper for positioning copy button */}
              <textarea
                id="output-textarea"
                readOnly
                value={isOutputError ? output.replace('Error: ', '') : output} // Display error without "Error: " prefix
                placeholder="Result will appear here..."
                rows={10} // Added rows for consistent sizing
                className={`
                  w-full p-2.5 font-mono text-sm border rounded-lg resize-y /* Added resize-y */
                  bg-gray-100 dark:bg-gray-900 dark:border-gray-700
                  text-gray-800 dark:text-gray-200
                  cursor-default /* Indicates it's not editable */
                  focus:outline-none /* Remove focus outline for readOnly */
                  ${isOutputError ? 'border-red-500 ring-red-500 text-red-600 dark:text-red-400 font-semibold' : ''} /* Error styling */
                `}
              />
              <CopyButton valueToCopy={output} ariaLabel={`Copy ${mode === 'encode' ? 'encoded' : 'decoded'} URL component`} />
            </div>
            {isOutputError && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                {output.replace('Error: ', '')} {/* Show the actual error message */}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}