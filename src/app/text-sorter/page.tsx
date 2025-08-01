'use client';

import { useState, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, X } from 'lucide-react';

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
            className={`p-2 rounded-md transition-all duration-200 ease-in-out ${isValueEmpty ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
    );
}

const TextSorterPage = () => {
    const [text, setText] = useState('Zebra\nApple\nCat\nBanana');
    const [filter, setFilter] = useState('');

    const sort = (type: 'asc' | 'desc' | 'len_asc' | 'len_desc' | 'reverse' | 'dedupe') => {
        triggerHapticFeedback();
        let lines = text.split('\n');
        switch (type) {
            case 'asc': lines.sort(); break;
            case 'desc': lines.sort().reverse(); break;
            case 'len_asc': lines.sort((a, b) => a.length - b.length); break;
            case 'len_desc': lines.sort((a, b) => b.length - a.length); break;
            case 'reverse': lines.reverse(); break;
            case 'dedupe': lines = [...new Set(lines)]; break;
        }
        setText(lines.join('\n'));
    };

    const filteredText = text.split('\n').filter(line => line.toLowerCase().includes(filter.toLowerCase())).join('\n');

    const stats = {
        lines: text.split('\n').filter(Boolean).length,
        words: text.trim().split(/\s+/).filter(Boolean).length,
        chars: text.length,
    };

    return (
        <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Text Sorter</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Sort, filter, and manage your text lines effortlessly.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="relative mb-4">
                        <textarea
                            value={text}
                            onFocus={triggerHapticFeedback}
                            onChange={(e) => { setText(e.target.value); triggerHapticFeedback(); }}
                            rows={10}
                            className="w-full p-3 border rounded-md font-mono dark:bg-gray-900 dark:border-gray-600 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                            <CopyButton valueToCopy={text} ariaLabel="Copy Text" />
                            <button onClick={() => { setText(''); triggerHapticFeedback(); }} className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md"><X size={16} /></button>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <span>Characters: {stats.chars}</span>
                        <span>Words: {stats.words}</span>
                        <span>Lines: {stats.lines}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                        <button onClick={() => sort('asc')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">A-Z</button>
                        <button onClick={() => sort('desc')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Z-A</button>
                        <button onClick={() => sort('len_asc')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Length (Asc)</button>
                        <button onClick={() => sort('len_desc')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Length (Desc)</button>
                        <button onClick={() => sort('reverse')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Reverse</button>
                        <button onClick={() => sort('dedupe')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Remove Duplicates</button>
                    </div>

                    <div>
                        <label htmlFor="filter-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter Lines</label>
                        <input
                            id="filter-input"
                            type="text"
                            value={filter}
                            onFocus={triggerHapticFeedback}
                            onChange={(e) => { setFilter(e.target.value); triggerHapticFeedback(); }}
                            placeholder="Filter by text..."
                            className="w-full p-3 border rounded-md dark:bg-gray-900 dark:border-gray-600"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Result</label>
                        <textarea
                            readOnly
                            value={filteredText}
                            rows={10}
                            className="w-full p-3 border rounded-md font-mono bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 resize-y"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextSorterPage;
