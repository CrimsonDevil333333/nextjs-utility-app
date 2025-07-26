'use client';

import { useState, useEffect, useCallback } from 'react';

// Reusable CopyButton component (assuming this is shared or re-defined here)
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

// Global lorem ipsum words for generation
const loremWords = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
const classicLoremStart = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

type Unit = 'paragraphs' | 'sentences' | 'words';

function generateRandomText(
  count: number,
  unit: Unit,
  startWithLorem: boolean
): string {
  let result = '';

  const getRandomWord = () => loremWords[Math.floor(Math.random() * loremWords.length)];
  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  if (startWithLorem && unit === 'paragraphs') {
    result += classicLoremStart + '\n\n';
    count--; // Decrement count as one paragraph is used
  } else if (startWithLorem && unit === 'sentences') {
    result += classicLoremStart.split('. ').slice(0, 1).join('') + '. '; // Just the first sentence
    count--;
  } else if (startWithLorem && unit === 'words') {
    result += 'Lorem ipsum dolor sit amet. '; // Just a few words
    count -= 5; // Approximate word count for this start
  }


  for (let i = 0; i < count; i++) {
    let currentBlock = '';
    let blockLength: number; // Words or sentences per block

    if (unit === 'paragraphs') {
      blockLength = Math.floor(Math.random() * 5) + 3; // 3-7 sentences per paragraph
      for (let s = 0; s < blockLength; s++) {
        const sentenceLength = Math.floor(Math.random() * 15) + 5; // 5-20 words per sentence
        let sentence = '';
        for (let w = 0; w < sentenceLength; w++) {
          sentence += getRandomWord() + ' ';
        }
        currentBlock += capitalizeFirstLetter(sentence.trim()) + '. ';
      }
      result += currentBlock.trim() + '\n\n';
    } else if (unit === 'sentences') {
      blockLength = Math.floor(Math.random() * 15) + 5; // 5-20 words per sentence
      for (let w = 0; w < blockLength; w++) {
        currentBlock += getRandomWord() + ' ';
      }
      result += capitalizeFirstLetter(currentBlock.trim()) + '. ';
    } else { // words
      blockLength = 1; // Always one word per iteration
      currentBlock += getRandomWord() + ' ';
      result += currentBlock;
    }
  }

  return result.trim();
}


export default function LoremIpsumPage() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<Unit>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(false);
  const [text, setText] = useState('');

  const handleGenerate = useCallback(() => {
    setText(generateRandomText(count, unit, startWithLorem));
  }, [count, unit, startWithLorem]);

  // Generate on initial load
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleClear = useCallback(() => {
    setText('');
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Lorem Ipsum Generator</h1>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <label htmlFor="unit-count" className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
              Number of {unit.charAt(0).toUpperCase() + unit.slice(1)}:
            </label>
            <input 
              id="unit-count"
              type="number" 
              value={count} 
              onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))} 
              min="1"
              className="w-24 p-2.5 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-md shadow-inner">
            <button 
              onClick={() => setUnit('paragraphs')} 
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${unit === 'paragraphs' ? 'bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              Paragraphs
            </button>
            <button 
              onClick={() => setUnit('sentences')} 
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${unit === 'sentences' ? 'bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              Sentences
            </button>
            <button 
              onClick={() => setUnit('words')} 
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${unit === 'words' ? 'bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              Words
            </button>
          </div>
        </div>

        {/* Options Checkbox */}
        <div className="mb-6">
          <label htmlFor="start-lorem" className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              id="start-lorem" 
              checked={startWithLorem} 
              onChange={e => setStartWithLorem(e.target.checked)} 
              className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Start with "Lorem ipsum dolor sit amet..."</span>
          </label>
        </div>

        {/* Textarea and Action Buttons */}
        <textarea
          readOnly
          value={text}
          rows={15}
          className="w-full p-2.5 text-base border rounded-lg resize-y /* Consistent padding, resize */
                     bg-gray-100 dark:bg-gray-900 dark:border-gray-700 
                     text-gray-800 dark:text-gray-200 leading-relaxed font-sans /* Use font-sans for better readability */
                     cursor-text select-all mb-4 /* Allow text selection */"
          placeholder="Generated Lorem Ipsum will appear here..."
        />
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={handleGenerate} 
            className="px-5 py-2 text-base font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center space-x-2"
            title="Generate Lorem Ipsum"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Generate</span>
          </button>
          
          <CopyButton valueToCopy={text} ariaLabel="Copy generated Lorem Ipsum" />

          <button 
            onClick={handleClear} 
            className="px-5 py-2 text-base font-medium bg-gray-400 hover:bg-gray-500 text-white rounded-md transition-colors shadow focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center space-x-2"
            title="Clear generated text"
            disabled={!text.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}