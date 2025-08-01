'use client';

import { useState, useCallback, useMemo } from 'react';
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

export default function FindReplacePage() {
  const [inputText, setInputText] = useState<string>('The quick brown fox jumps over the lazy dog. The fox is fast.');
  const [findText, setFindText] = useState<string>('fox');
  const [replaceText, setReplaceText] = useState<string>('cat');
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [matchWholeWord, setMatchWholeWord] = useState<boolean>(false);
  const [useRegex, setUseRegex] = useState<boolean>(false);
  const [outputText, setOutputText] = useState<string>('');
  const [matchesCount, setMatchesCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const performFindAndReplace = useCallback(() => {
    triggerHapticFeedback();
    setError(null);
    if (!findText) {
      setOutputText(inputText);
      setMatchesCount(0);
      return;
    }

    let searchPattern: RegExp;
    let flags = 'g';

    if (!caseSensitive) {
      flags += 'i';
    }

    try {
      if (useRegex) {
        searchPattern = new RegExp(findText, flags);
      } else {
        const escapedFindText = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        searchPattern = new RegExp(matchWholeWord ? `\\b${escapedFindText}\\b` : escapedFindText, flags);
      }
    } catch (e: any) {
      setError(`Invalid regex: ${e.message}`);
      setOutputText(inputText);
      setMatchesCount(0);
      return;
    }

    const newText = inputText.replace(searchPattern, replaceText);
    setOutputText(newText);

    const matches = inputText.match(searchPattern);
    setMatchesCount(matches ? matches.length : 0);

  }, [inputText, findText, replaceText, caseSensitive, matchWholeWord, useRegex]);

  useMemo(() => {
    performFindAndReplace();
  }, [inputText, findText, replaceText, caseSensitive, matchWholeWord, useRegex, performFindAndReplace]);

  const handleClear = useCallback(() => {
    triggerHapticFeedback();
    setInputText('');
    setFindText('');
    setReplaceText('');
    setCaseSensitive(false);
    setMatchWholeWord(false);
    setUseRegex(false);
    setOutputText('');
    setMatchesCount(0);
    setError(null);
  }, []);

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Find & Replace Text</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Instantly find and replace text with advanced options.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Original Text
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onFocus={triggerHapticFeedback}
              onChange={(e) => { setInputText(e.target.value); triggerHapticFeedback(); }}
              placeholder="Paste your text here..."
              rows={8}
              className="w-full p-3 font-sans text-base border rounded-lg resize-y bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="find-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Find
              </label>
              <input
                type="text"
                id="find-text"
                value={findText}
                onFocus={triggerHapticFeedback}
                onChange={(e) => { setFindText(e.target.value); triggerHapticFeedback(); }}
                placeholder="Text to find"
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="replace-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Replace With
              </label>
              <input
                type="text"
                id="replace-text"
                value={replaceText}
                onFocus={triggerHapticFeedback}
                onChange={(e) => { setReplaceText(e.target.value); triggerHapticFeedback(); }}
                placeholder="Replacement text"
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <label className="flex items-center text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => { setCaseSensitive(e.target.checked); triggerHapticFeedback(); }}
                className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              Case Sensitive
            </label>
            <label className="flex items-center text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={matchWholeWord}
                onChange={(e) => { setMatchWholeWord(e.target.checked); if (e.target.checked) setUseRegex(false); triggerHapticFeedback(); }}
                disabled={useRegex}
                className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 disabled:opacity-50"
              />
              Match Whole Word
            </label>
            <label className="flex items-center text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={(e) => { setUseRegex(e.target.checked); if (e.target.checked) setMatchWholeWord(false); triggerHapticFeedback(); }}
                className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              Use Regular Expression
            </label>
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>}

          <div className="relative mb-6">
            <label htmlFor="output-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Result ({matchesCount} matches replaced)
            </label>
            <div className="relative">
              <textarea
                id="output-text"
                value={outputText}
                readOnly
                rows={8}
                className="w-full p-3 font-sans text-base border rounded-lg resize-y bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default select-all pr-12"
                placeholder="Result will appear here..."
              />
              <div className="absolute top-2 right-2">
                <CopyButton valueToCopy={outputText} ariaLabel="Copy result text" />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={performFindAndReplace}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              Perform Replace
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
              aria-label="Clear all fields"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
