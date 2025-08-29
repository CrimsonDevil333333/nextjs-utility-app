'use client';

import { useState, useCallback, useMemo } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

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
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center space-x-1 transition-all duration-200 ease-in-out ${isValueEmpty ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
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

const SlugGeneratorPage = () => {
    const [text, setText] = useState('Hello World! This is a Title.');
    const [separator, setSeparator] = useState('-');
    const [slugCase, setSlugCase] = useState<'lower' | 'upper'>('lower');

    const slug = useMemo(() => {
        let processedText = text;
        if (slugCase === 'lower') {
            processedText = processedText.toLowerCase();
        } else {
            processedText = processedText.toUpperCase();
        }

        return processedText
            .replace(/\s+/g, separator)       // Replace spaces with the selected separator
            .replace(new RegExp(`[^\\w\\${separator}]+`, 'g'), '') // Remove all non-word chars except the separator
            .replace(new RegExp(`\\${separator}+`, 'g'), separator); // Replace multiple separators with a single one
    }, [text, separator, slugCase]);

    const handleClear = () => {
        triggerHapticFeedback();
        setText('');
    };

    return (
        <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Slug Generator</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Create clean, URL-friendly slugs from your text.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
                    <div>
                        <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input Text</label>
                        <div className="relative">
                            <textarea
                                id="input-text"
                                value={text}
                                onFocus={triggerHapticFeedback}
                                onChange={(e) => { setText(e.target.value); triggerHapticFeedback(); }}
                                placeholder="Enter text"
                                rows={4}
                                className="w-full p-3 border rounded-md dark:bg-gray-900 dark:border-gray-600 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {text && (
                                <button onClick={handleClear} className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md">Clear</button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="separator" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Separator</label>
                            <select id="separator" value={separator} onFocus={triggerHapticFeedback} onChange={(e) => { setSeparator(e.target.value); triggerHapticFeedback(); }} className="w-full p-3 border rounded-md dark:bg-gray-900 dark:border-gray-600">
                                <option value="-">Hyphen (-)</option>
                                <option value="_">Underscore (_)</option>
                                <option value=".">Period (.)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="case" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Case</label>
                            <select id="case" value={slugCase} onFocus={triggerHapticFeedback} onChange={(e) => { setSlugCase(e.target.value as 'lower' | 'upper'); triggerHapticFeedback(); }} className="w-full p-3 border rounded-md dark:bg-gray-900 dark:border-gray-600">
                                <option value="lower">Lowercase</option>
                                <option value="upper">Uppercase</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="output-slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Generated Slug</label>
                        <div className="relative">
                            <input
                                id="output-slug"
                                type="text"
                                value={slug}
                                readOnly
                                className="w-full p-3 border rounded-md font-mono bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 pr-24"
                            />
                            <div className="absolute top-1/2 -translate-y-1/2 right-3">
                                <CopyButton valueToCopy={slug} ariaLabel="Copy Slug" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="url-preview" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL Preview</label>
                        <div className="relative">
                            <input
                                id="url-preview"
                                type="text"
                                value={`https://example.com/${slug}`}
                                readOnly
                                className="w-full p-3 border rounded-md font-mono bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlugGeneratorPage;
