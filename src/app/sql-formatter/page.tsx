'use client';

import { useState, useCallback } from 'react';
import { format } from 'sql-formatter';
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

const SQLFormatterPage = () => {
    const [sql, setSql] = useState('SELECT id, name FROM users WHERE status = \'active\' AND age > 21 ORDER BY name;');
    const [formattedSql, setFormattedSql] = useState('');
    const [language, setLanguage] = useState<'sql' | 'mysql' | 'postgresql' | 'tsql'>('sql');
    const [tabWidth, setTabWidth] = useState(2);
    const [useTabs, setUseTabs] = useState(false);
    const [keywordCase, setKeywordCase] = useState<'upper' | 'lower'>('upper');

    const handleFormat = () => {
        triggerHapticFeedback();
        try {
            setFormattedSql(format(sql, {
                language: language,
                tabWidth: tabWidth,
                useTabs: useTabs,
                keywordCase: keywordCase,
            }));
        } catch (error) {
            setFormattedSql('Error: Invalid SQL');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">SQL Formatter</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Format and beautify your SQL queries with ease.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="sql-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input SQL</label>
                            <textarea
                                id="sql-input"
                                value={sql}
                                onFocus={triggerHapticFeedback}
                                onChange={(e) => { setSql(e.target.value); triggerHapticFeedback(); }}
                                placeholder="Enter SQL"
                                rows={8}
                                className="w-full p-3 border rounded-md font-mono dark:bg-gray-900 dark:border-gray-600 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="formatted-sql" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Formatted SQL</label>
                            <div className="relative">
                                <textarea
                                    id="formatted-sql"
                                    value={formattedSql}
                                    readOnly
                                    placeholder="Formatted SQL will appear here..."
                                    rows={8}
                                    className="w-full p-3 border rounded-md font-mono bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 resize-y pr-24"
                                />
                                <div className="absolute top-3 right-3">
                                    <CopyButton valueToCopy={formattedSql} ariaLabel="Copy Formatted SQL" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                            <select id="language" value={language} onFocus={triggerHapticFeedback} onChange={(e) => { setLanguage(e.target.value as 'sql' | 'mysql' | 'postgresql' | 'tsql'); triggerHapticFeedback(); }} className="w-full p-3 border rounded-md dark:bg-gray-900 dark:border-gray-600">
                                <option value="sql">Standard SQL</option>
                                <option value="mysql">MySQL</option>
                                <option value="postgresql">PostgreSQL</option>
                                <option value="tsql">Transact-SQL</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tab-width" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tab Width</label>
                            <input id="tab-width" type="number" value={tabWidth} onFocus={triggerHapticFeedback} onChange={(e) => { setTabWidth(parseInt(e.target.value)); triggerHapticFeedback(); }} className="w-full p-3 border rounded-md dark:bg-gray-900 dark:border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="use-tabs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Use Tabs</label>
                            <input id="use-tabs" type="checkbox" checked={useTabs} onChange={(e) => { setUseTabs(e.target.checked); triggerHapticFeedback(); }} className="mt-3 h-5 w-5 text-blue-600 rounded" />
                        </div>
                        <div>
                            <label htmlFor="keyword-case" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Keyword Case</label>
                            <select id="keyword-case" value={keywordCase} onFocus={triggerHapticFeedback} onChange={(e) => { setKeywordCase(e.target.value as 'upper' | 'lower'); triggerHapticFeedback(); }} className="w-full p-3 border rounded-md dark:bg-gray-900 dark:border-gray-600">
                                <option value="upper">Uppercase</option>
                                <option value="lower">Lowercase</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button onClick={handleFormat} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Format SQL</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SQLFormatterPage;
