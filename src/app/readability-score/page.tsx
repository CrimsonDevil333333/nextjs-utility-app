'use client';

import { useState, useMemo, useCallback } from 'react';
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

// --- Readability Logic ---

const countSyllables = (word: string): number => {
    word = word.toLowerCase();
    if (word.length <= 3) { return 1; }
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 0;
};

const ReadabilityScorePage = () => {
    const [text, setText] = useState('');

    const { words, sentences, syllables, score, gradeLevel } = useMemo(() => {
        if (!text.trim()) {
            return { words: 0, sentences: 0, syllables: 0, score: 0, gradeLevel: 'N/A' };
        }

        const wordList = text.trim().match(/\b\w+\b/g) || [];
        const sentenceList = text.trim().match(/[^.!?]+[.!?]+/g) || [];
        const numWords = wordList.length;
        const numSentences = sentenceList.length;
        const numSyllables = wordList.map(countSyllables).reduce((a, b) => a + b, 0);

        if (numWords === 0 || numSentences === 0) {
            return { words: numWords, sentences: numSentences, syllables: numSyllables, score: 0, gradeLevel: 'N/A' };
        }

        const fleschScore = 206.835 - 1.015 * (numWords / numSentences) - 84.6 * (numSyllables / numWords);

        let level = 'N/A';
        if (fleschScore >= 90) level = '5th Grade (Very Easy)';
        else if (fleschScore >= 80) level = '6th Grade (Easy)';
        else if (fleschScore >= 70) level = '7th Grade (Fairly Easy)';
        else if (fleschScore >= 60) level = '8th-9th Grade (Standard)';
        else if (fleschScore >= 50) level = '10th-12th Grade (Fairly Difficult)';
        else if (fleschScore >= 30) level = 'College (Difficult)';
        else level = 'College Graduate (Very Difficult)';

        return {
            words: numWords,
            sentences: numSentences,
            syllables: numSyllables,
            score: Math.max(0, fleschScore).toFixed(1),
            gradeLevel: level,
        };
    }, [text]);

    const handleClear = () => {
        triggerHapticFeedback();
        setText('');
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Readability Score Analyzer 🧐</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Analyze your text's reading level.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
                    <div className="relative mb-4">
                        <textarea
                            value={text}
                            onFocus={triggerHapticFeedback}
                            onChange={(e) => { setText(e.target.value); triggerHapticFeedback(); }}
                            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y"
                            placeholder="Paste your text here to analyze its reading level..."
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                            <CopyButton valueToCopy={text} ariaLabel="Copy Text" />
                            <button onClick={handleClear} className="px-3 py-1.5 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md" title="Clear Text">Clear</button>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Words</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{words}</p>
                        </div>
                        <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sentences</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{sentences}</p>
                        </div>
                        <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Syllables</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{syllables}</p>
                        </div>
                    </div>

                    <div className="mt-6 p-6 bg-purple-50 dark:bg-purple-900/50 rounded-lg text-center">
                        <p className="text-lg text-purple-800 dark:text-purple-200">Flesch Reading Ease Score</p>
                        <p className="text-5xl font-extrabold my-2 text-purple-600 dark:text-purple-400">{score}</p>
                        <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">{gradeLevel}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadabilityScorePage;
