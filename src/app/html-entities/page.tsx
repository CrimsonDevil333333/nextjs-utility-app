'use client';

import { useState, useCallback, useEffect } from 'react';

// Reusable CopyButton component
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

export default function HtmlEntitiesPage() {
    const [inputText, setInputText] = useState<string>('<p>Hello, &quot;World&quot;! &copy;</p>');
    const [outputEncoded, setOutputEncoded] = useState<string>('');
    const [outputDecoded, setOutputDecoded] = useState<string>('');

    // Client-only encoding/decoding functions
    const encodeHtmlEntities = (text: string): string => {
        const element = document.createElement('div');
        element.textContent = text;
        return element.innerHTML;
    };

    const decodeHtmlEntities = (text: string): string => {
        const element = document.createElement('div');
        element.innerHTML = text;
        return element.textContent || '';
    };

    useEffect(() => {
        setOutputEncoded(encodeHtmlEntities(inputText));
        setOutputDecoded(decodeHtmlEntities(inputText));
    }, [inputText]);

    const handleClear = useCallback(() => {
        setInputText('');
        setOutputEncoded('');
        setOutputDecoded('');
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">HTML Entity Encoder/Decoder</h1>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                    <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enter Text or HTML
                    </label>
                    <textarea
                        id="input-text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="e.g., <p>Hello & World!</p>"
                        rows={6}
                        className="w-full p-2.5 font-mono text-base border rounded-lg resize-y bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="encoded-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Encoded HTML Entities
                    </label>
                    <div className="relative">
                        <textarea
                            id="encoded-output"
                            value={outputEncoded}
                            readOnly
                            rows={4}
                            className="w-full p-2.5 font-mono text-base border rounded-lg resize-y bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default select-all pr-12"
                            placeholder="Encoded entities will appear here..."
                        />
                        <div className="absolute top-2 right-2">
                            <CopyButton valueToCopy={outputEncoded} ariaLabel="Copy encoded text" />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="decoded-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Decoded Text
                    </label>
                    <div className="relative">
                        <textarea
                            id="decoded-output"
                            value={outputDecoded}
                            readOnly
                            rows={4}
                            className="w-full p-2.5 font-mono text-base border rounded-lg resize-y bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default select-all pr-12"
                            placeholder="Decoded text will appear here..."
                        />
                        <div className="absolute top-2 right-2">
                            <CopyButton valueToCopy={outputDecoded} ariaLabel="Copy decoded text" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                        aria-label="Clear input and outputs"
                        title="Clear All"
                        disabled={!inputText.trim()}
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
}
