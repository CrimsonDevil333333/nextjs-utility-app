'use client';

import { useState, useCallback, useMemo, ReactNode } from 'react';
import * as Diff from 'diff-match-patch';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, X, ArrowRightLeft } from 'lucide-react';

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

export default function TextDiffPage() {
  const [text1, setText1] = useState<string>('The quick brown fox jumps over the lazy dog.\nLine 2.\nLine 3.');
  const [text2, setText2] = useState<string>('The quick brown cat jumps over the very lazy dog.\nAnother line.\nLine 3.');
  const [viewType, setViewType] = useState<'inline' | 'sideBySide'>('inline');

  const dmp = useMemo(() => new Diff.diff_match_patch(), []);

  const { diffOutput, stats } = useMemo(() => {
    if (!text1 && !text2) {
      return { diffOutput: '', stats: { added: { chars: 0, words: 0 }, removed: { chars: 0, words: 0 } } };
    }

    const diffs = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(diffs);

    let addedChars = 0, removedChars = 0, addedWords = 0, removedWords = 0;

    const renderedDiff = diffs.map((part, index) => {
      const type = part[0];
      const value = part[1];
      const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

      let className = '';
      if (type === Diff.DIFF_INSERT) {
        className = 'bg-green-100 dark:bg-green-900/50';
        addedChars += value.length;
        addedWords += wordCount;
      } else if (type === Diff.DIFF_DELETE) {
        className = 'bg-red-100 dark:bg-red-900/50 line-through';
        removedChars += value.length;
        removedWords += wordCount;
      }

      return <span key={index} className={className}>{value}</span>;
    });

    return {
      diffOutput: renderedDiff,
      stats: {
        added: { chars: addedChars, words: addedWords },
        removed: { chars: removedChars, words: removedWords }
      }
    };
  }, [text1, text2, dmp]);

  const handleClear = useCallback(() => {
    triggerHapticFeedback();
    setText1('');
    setText2('');
  }, []);

  const handleSwap = () => {
    triggerHapticFeedback();
    setText1(text2);
    setText2(text1);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Text Difference Checker</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Compare two texts and highlight the differences.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative">
            <div>
              <label htmlFor="text1-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original Text</label>
              <textarea id="text1-input" value={text1} onFocus={triggerHapticFeedback} onChange={(e) => { setText1(e.target.value); triggerHapticFeedback(); }} placeholder="Paste original text..." rows={12} className="w-full p-3 font-mono text-base border rounded-lg resize-y bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:hidden flex justify-center my-4">
              <button onClick={handleSwap} className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-transform hover:scale-110">
                <ArrowRightLeft size={20} />
              </button>
            </div>
            <div>
              <label htmlFor="text2-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New/Modified Text</label>
              <textarea id="text2-input" value={text2} onFocus={triggerHapticFeedback} onChange={(e) => { setText2(e.target.value); triggerHapticFeedback(); }} placeholder="Paste modified text..." rows={12} className="w-full p-3 font-mono text-base border rounded-lg resize-y bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button onClick={handleSwap} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-transform hover:scale-110 hidden md:block">
              <ArrowRightLeft size={20} />
            </button>
          </div>

          <div className="flex justify-center mb-6">
            <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
              <button onClick={() => { setViewType('inline'); triggerHapticFeedback(); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${viewType === 'inline' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Inline View</button>
              <button onClick={() => { setViewType('sideBySide'); triggerHapticFeedback(); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${viewType === 'sideBySide' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Side-by-Side</button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Differences</label>
            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-900/50 p-2 rounded-t-lg border-b dark:border-gray-700">
              <div className="flex gap-4 text-sm">
                <span className="text-green-600 dark:text-green-400"><strong>+{stats.added.words}</strong> words, <strong>+{stats.added.chars}</strong> chars</span>
                <span className="text-red-600 dark:text-red-400"><strong>-{stats.removed.words}</strong> words, <strong>-{stats.removed.chars}</strong> chars</span>
              </div>
              <CopyButton valueToCopy={text1 + '\n---\n' + text2} ariaLabel="Copy both texts" />
            </div>
            <div className="relative p-3 border rounded-b-lg bg-gray-50 dark:bg-gray-900/20 dark:border-gray-700 overflow-auto whitespace-pre-wrap font-mono text-sm min-h-[150px]">
              {viewType === 'inline' ? (
                <div>{diffOutput || 'No differences to show or texts are identical.'}</div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>{dmp.diff_main(text1, text2).map((part, i) => part[0] !== 1 && <span key={i} className={part[0] === -1 ? 'bg-red-100 dark:bg-red-900/50 line-through' : ''}>{part[1]}</span>)}</div>
                  <div>{dmp.diff_main(text1, text2).map((part, i) => part[0] !== -1 && <span key={i} className={part[0] === 1 ? 'bg-green-100 dark:bg-green-900/50' : ''}>{part[1]}</span>)}</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button onClick={handleClear} className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors">Clear All</button>
          </div>
        </div>
      </div>
    </div>
  );
}
