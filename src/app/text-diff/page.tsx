// app/text-diff/page.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';
import * as Diff from 'diff-match-patch';

// Reusable CopyButton component (assuming it's available or define it here if not)
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

export default function TextDiffPage() {
  const [text1, setText1] = useState<string>('The quick brown fox jumps over the lazy dog.\nLine 2.\nLine 3.');
  const [text2, setText2] = useState<string>('The quick brown cat jumps over the very lazy dog.\nAnother line.\nLine 3.');
  const [diffOutput, setDiffOutput] = useState<React.ReactNode[] | string>('');

  const dmp = useMemo(() => new Diff.diff_match_patch(), []);

  const generateDiff = useCallback(() => {
    if (!text1 && !text2) {
      setDiffOutput('');
      return;
    }

    const diffs = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(diffs); // Optional: cleans up the diff for better readability

    const renderedDiff = diffs.map((part, index) => {
      // part[0] is the type of change (-1: deletion, 0: equality, 1: insertion)
      // part[1] is the text segment
      const type = part[0];
      const value = part[1];

      let className = '';
      if (type === Diff.DIFF_INSERT) {
        className = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      } else if (type === Diff.DIFF_DELETE) {
        className = 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 line-through';
      } else {
        className = 'text-gray-900 dark:text-gray-100'; // No change
      }

      // Preserve newlines for visual clarity in a <pre> tag
      const segments = value.split('\n').map((segment, segIndex, arr) => (
        <span key={`${index}-${segIndex}`} className={className}>
          {segment}
          {segIndex < arr.length - 1 ? <br /> : null} {/* Add <br> for newlines */}
        </span>
      ));

      return <span key={index}>{segments}</span>;
    });

    setDiffOutput(renderedDiff);

  }, [text1, text2, dmp]);

  useMemo(() => {
    generateDiff();
  }, [text1, text2, generateDiff]);

  const handleClear = useCallback(() => {
    setText1('');
    setText2('');
    setDiffOutput('');
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Text Difference Checker</h1>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="text1-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Original Text
            </label>
            <textarea
              id="text1-input"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Paste your original text here..."
              rows={12}
              className="w-full p-2.5 font-mono text-base border rounded-lg resize-y bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
            />
          </div>

          <div>
            <label htmlFor="text2-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New/Modified Text
            </label>
            <textarea
              id="text2-input"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Paste the modified text here..."
              rows={12}
              className="w-full p-2.5 font-mono text-base border rounded-lg resize-y bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
            />
          </div>
        </div>

        <button
          onClick={generateDiff}
          className="w-full px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow transition-colors duration-200 ease-in-out mb-6"
        >
          Compare Texts
        </button>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Differences
          </label>
          <div className="relative p-2.5 border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 overflow-auto whitespace-pre-wrap font-mono text-sm" style={{ minHeight: '150px' }}>
            {diffOutput || 'No differences to show or texts are identical.'}
            <div className="absolute top-2 right-2">
                <CopyButton valueToCopy={text1 + '\n---\n' + text2} ariaLabel="Copy both texts" /> {/* Can improve this to copy just the diff HTML or plain text */}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-block w-3 h-3 bg-green-100 dark:bg-green-900 mr-1 border border-green-300"></span> Added &nbsp;
            <span className="inline-block w-3 h-3 bg-red-100 dark:bg-red-900 mr-1 border border-red-300"></span> Removed &nbsp;
            <span className="inline-block w-3 h-3 bg-gray-200 dark:bg-gray-700 mr-1 border border-gray-400"></span> Unchanged
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
            aria-label="Clear all inputs and output"
            title="Clear All"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}