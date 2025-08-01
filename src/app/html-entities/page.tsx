'use client';

import { useState, useCallback, useEffect } from 'react';
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
        triggerHapticFeedback();
        setInputText('');
        setOutputEncoded('');
        setOutputDecoded('');
    }, []);

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">HTML Entity Encoder/Decoder</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Easily encode or decode HTML entities in your text.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
                    <div>
                        <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Enter Text or HTML
                        </label>
                        <textarea
                            id="input-text"
                            value={inputText}
                            onFocus={triggerHapticFeedback}
                            onChange={(e) => { setInputText(e.target.value); triggerHapticFeedback(); }}
                            placeholder="e.g., <p>Hello & World!</p>"
                            rows={6}
                            className="w-full p-3 font-mono text-base border rounded-lg resize-y bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="encoded-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Encoded HTML Entities
                        </label>
                        <div className="relative">
                            <textarea
                                id="encoded-output"
                                value={outputEncoded}
                                readOnly
                                rows={4}
                                className="w-full p-3 font-mono text-base border rounded-lg resize-y bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default select-all pr-24"
                                placeholder="Encoded entities will appear here..."
                            />
                            <div className="absolute top-2 right-2">
                                <CopyButton valueToCopy={outputEncoded} ariaLabel="Copy encoded text" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="decoded-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Decoded Text
                        </label>
                        <div className="relative">
                            <textarea
                                id="decoded-output"
                                value={outputDecoded}
                                readOnly
                                rows={4}
                                className="w-full p-3 font-mono text-base border rounded-lg resize-y bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default select-all pr-24"
                                placeholder="Decoded text will appear here..."
                            />
                            <div className="absolute top-2 right-2">
                                <CopyButton valueToCopy={outputDecoded} ariaLabel="Copy decoded text" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleClear}
                            className="px-6 py-3 text-sm font-semibold bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg transition-colors disabled:opacity-50"
                            aria-label="Clear input and outputs"
                            title="Clear All"
                            disabled={!inputText.trim()}
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
