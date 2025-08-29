'use client';

import { useState, useMemo, useCallback, ReactNode } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Book, ChevronDown, Lightbulb } from 'lucide-react';

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

// --- New Feature Components ---

const RegexCheatsheet = () => {
    const [isOpen, setIsOpen] = useState(false);
    const cheatsheetItems = {
        'Common Tokens': [
            { token: '.', description: 'Any character except newline' },
            { token: '\\w', description: 'Word character (a-z, A-Z, 0-9, _)' },
            { token: '\\d', description: 'Digit (0-9)' },
            { token: '\\s', description: 'Whitespace character' },
            { token: '^', description: 'Start of the string' },
            { token: '$', description: 'End of the string' },
        ],
        'Quantifiers': [
            { token: '*', description: '0 or more times' },
            { token: '+', description: '1 or more times' },
            { token: '?', description: '0 or 1 time' },
            { token: '{n}', description: 'Exactly n times' },
            { token: '{n,}', description: 'n or more times' },
            { token: '{n,m}', description: 'Between n and m times' },
        ],
        'Groups & Ranges': [
            { token: '[abc]', description: 'Any of a, b, or c' },
            { token: '[^abc]', description: 'Not a, b, or c' },
            { token: '[a-z]', description: 'Characters a through z' },
            { token: '(abc)', description: 'Capture group for "abc"' },
        ],
    };

    return (
        <div className="mb-4">
            <button onClick={() => { setIsOpen(!isOpen); triggerHapticFeedback(); }} className="flex items-center justify-between w-full p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-2">
                    <Book size={18} />
                    <span className="font-semibold">Regex Cheatsheet</span>
                </div>
                <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border dark:border-gray-700">
                    {Object.entries(cheatsheetItems).map(([category, items]) => (
                        <div key={category}>
                            <h4 className="font-bold mb-2 text-gray-800 dark:text-gray-200">{category}</h4>
                            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                {items.map(item => (
                                    <li key={item.token} className="flex justify-between">
                                        <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded font-mono">{item.token}</code>
                                        <span>{item.description}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const RegexExplanation = ({ pattern, flags }: { pattern: string, flags: string }) => {
    const flagExplanations: Record<string, string> = {
        g: 'Global: Find all matches, not just the first one.',
        i: 'Case-Insensitive: Ignore differences between uppercase and lowercase.',
        m: 'Multiline: ^ and $ match the start/end of lines, not just the whole string.',
        s: 'Dot All: The dot (.) character matches newline characters as well.',
    };

    const explanation = useMemo(() => {
        // This is a simplified explanation and won't cover all regex complexities.
        const parts = [];
        if (pattern.startsWith('^')) parts.push('Asserts position at the start of the string.');
        if (pattern.endsWith('$')) parts.push('Asserts position at the end of the string.');

        const simpleTokens: Record<string, string> = {
            '\\b': 'a word boundary',
            '\\d': 'a digit (0-9)',
            '\\w': 'a word character (alphanumeric + underscore)',
            '\\s': 'a whitespace character',
            '.': 'any character (except newline)',
        };

        for (const [token, desc] of Object.entries(simpleTokens)) {
            if (pattern.includes(token)) {
                parts.push(`Contains <code class="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">${token}</code> which matches ${desc}.`);
            }
        }

        const charSets = pattern.match(/\[(.*?)\]/g);
        if (charSets) {
            charSets.forEach(set => {
                parts.push(`Contains a character set <code class="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">${set}</code>.`);
            });
        }

        const quantifiers = pattern.match(/[\*\+\?\{\d+(,\d*)?\}]/g);
        if (quantifiers) {
            quantifiers.forEach(q => {
                parts.push(`Uses quantifier <code class="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">${q}</code>.`);
            });
        }

        return parts.length > 0 ? parts : ['A basic literal string search.'];
    }, [pattern]);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><Lightbulb size={20} /> Explanation</h2>
            <div className="p-4 border rounded-md bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 space-y-3">
                <div>
                    <h3 className="font-bold">Pattern Breakdown:</h3>
                    <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                        {explanation.map((part, i) => <li key={i} dangerouslySetInnerHTML={{ __html: part }} />)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold">Active Flags:</h3>
                    <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                        {flags.split('').map(flag => (
                            <li key={flag}>
                                <code className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">{flag}</code>: {flagExplanations[flag] || 'Unknown flag.'}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


// --- Main Page Component ---

const RegexTesterPage = () => {
    const [pattern, setPattern] = useState('\\b[A-Z]+\\b');
    const [flags, setFlags] = useState('g');
    const [testString, setTestString] = useState('This is a Test String with a few TEST words.');

    const { highlightedResult, error, matches } = useMemo(() => {
        try {
            const regex = new RegExp(pattern, flags);
            const result = testString.replace(regex, (match) => `<mark>${match}</mark>`);
            const allMatches = testString.match(regex) || [];
            return { highlightedResult: result, error: null, matches: allMatches };
        } catch (e: any) {
            return { highlightedResult: testString, error: `Invalid Regular Expression: ${e.message}`, matches: [] };
        }
    }, [pattern, flags, testString]);

    return (
        <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Regex Tester</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Test your regular expressions in real-time.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
                    <RegexCheatsheet />
                    <div>
                        <label htmlFor="regex-pattern" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Regular Expression</label>
                        <div className="flex gap-4">
                            <div className="relative flex-grow">
                                <input
                                    id="regex-pattern"
                                    type="text"
                                    value={pattern}
                                    onFocus={triggerHapticFeedback}
                                    onChange={(e) => { setPattern(e.target.value); triggerHapticFeedback(); }}
                                    placeholder="Regular Expression"
                                    className="w-full p-3 border rounded-md font-mono dark:bg-gray-900 dark:border-gray-600 pr-24"
                                />
                                <div className="absolute top-1/2 -translate-y-1/2 right-3">
                                    <CopyButton valueToCopy={pattern} ariaLabel="Copy Pattern" />
                                </div>
                            </div>
                            <input
                                type="text"
                                value={flags}
                                onFocus={triggerHapticFeedback}
                                onChange={(e) => { setFlags(e.target.value); triggerHapticFeedback(); }}
                                placeholder="Flags (e.g., gi)"
                                className="w-24 p-3 border rounded-md dark:bg-gray-900 dark:border-gray-600"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    <RegexExplanation pattern={pattern} flags={flags} />

                    <div>
                        <label htmlFor="test-string" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Test String</label>
                        <textarea
                            id="test-string"
                            value={testString}
                            onFocus={triggerHapticFeedback}
                            onChange={(e) => { setTestString(e.target.value); triggerHapticFeedback(); }}
                            placeholder="Test String"
                            rows={8}
                            className="w-full p-3 border rounded-md font-mono dark:bg-gray-900 dark:border-gray-600 resize-y"
                        ></textarea>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">Result</h2>
                        <div
                            className="p-4 border rounded-md bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 min-h-[100px]"
                            dangerouslySetInnerHTML={{ __html: highlightedResult }}
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">Matches ({matches.length})</h2>
                        <div className="p-4 border rounded-md bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 min-h-[100px]">
                            {matches.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {matches.map((match, index) => (
                                        <li key={index} className="font-mono">{match}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No matches found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegexTesterPage;
