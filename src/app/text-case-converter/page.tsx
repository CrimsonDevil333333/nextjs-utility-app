// app/text-case-converter/page.tsx
'use client';

import { useState, useCallback } from 'react';

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
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow focus:outline-none focus:ring-2 focus-ring-offset-2 dark:focus:ring-offset-gray-800'
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

export default function TextCaseConverterPage() {
  const [inputText, setInputText] = useState('Hello World, this is a test string.');
  const [outputText, setOutputText] = useState('');

  const toSentenceCase = (str: string) => {
    if (!str) return '';
    return str.toLowerCase().replace(/(^\s*\w|[.?!]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const toCamelCase = (str: string) => {
    if (!str) return '';
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  };

  const toPascalCase = (str: string) => {
    if (!str) return '';
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
  };

  const toKebabCase = (str: string) => {
    if (!str) return '';
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase().replace(/\s+/g, '-');
  };

  const toSnakeCase = (str: string) => {
    if (!str) return '';
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2').toLowerCase().replace(/\s+/g, '_');
  };

  const handleCaseConversion = useCallback((caseType: string) => {
    let convertedText = '';
    switch (caseType) {
      case 'sentence':
        convertedText = toSentenceCase(inputText);
        break;
      case 'lower':
        convertedText = inputText.toLowerCase();
        break;
      case 'upper':
        convertedText = inputText.toUpperCase();
        break;
      case 'title':
        convertedText = toTitleCase(inputText);
        break;
      case 'camel':
        convertedText = toCamelCase(inputText);
        break;
      case 'pascal':
        convertedText = toPascalCase(inputText);
        break;
      case 'kebab':
        convertedText = toKebabCase(inputText);
        break;
      case 'snake':
        convertedText = toSnakeCase(inputText);
        break;
      default:
        convertedText = inputText;
    }
    setOutputText(convertedText);
  }, [inputText]);

  const handleClear = useCallback(() => {
    setInputText('');
    setOutputText('');
  }, []);

  // Generate default output on initial load or input change
  useState(() => {
    handleCaseConversion('sentence'); // Default to sentence case
  });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Text Case Converter</h1>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input Text
          </label>
          <div className="relative">
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text here..."
              rows={6}
              className="w-full p-2.5 font-sans text-base border rounded-lg resize-y bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
            />
            <button
              onClick={handleClear}
              className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
              aria-label="Clear input"
              title="Clear Input"
              disabled={!inputText.trim()}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6">
          <button onClick={() => handleCaseConversion('sentence')} className="px-3 py-2 text-sm font-medium bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600 dark:text-gray-200 rounded-md transition-all duration-200 ease-in-out shadow-sm">Sentence Case</button>
          <button onClick={() => handleCaseConversion('lower')} className="px-3 py-2 text-sm font-medium bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600 dark:text-gray-200 rounded-md transition-all duration-200 ease-in-out shadow-sm">lowercase</button>
          <button onClick={() => handleCaseConversion('upper')} className="px-3 py-2 text-sm font-medium bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600 dark:text-gray-200 rounded-md transition-all duration-200 ease-in-out shadow-sm">UPPERCASE</button>
          <button onClick={() => handleCaseConversion('title')} className="px-3 py-2 text-sm font-medium bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600 dark:text-gray-200 rounded-md transition-all duration-200 ease-in-out shadow-sm">Title Case</button>
          <button onClick={() => handleCaseConversion('camel')} className="px-3 py-2 text-sm font-medium bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600 dark:text-gray-200 rounded-md transition-all duration-200 ease-in-out shadow-sm">camelCase</button>
          <button onClick={() => handleCaseConversion('pascal')} className="px-3 py-2 text-sm font-medium bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600 dark:text-gray-200 rounded-md transition-all duration-200 ease-in-out shadow-sm">PascalCase</button>
          <button onClick={() => handleCaseConversion('kebab')} className="px-3 py-2 text-sm font-medium bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600 dark:text-gray-200 rounded-md transition-all duration-200 ease-in-out shadow-sm">kebab-case</button>
          <button onClick={() => handleCaseConversion('snake')} className="px-3 py-2 text-sm font-medium bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600 dark:text-gray-200 rounded-md transition-all duration-200 ease-in-out shadow-sm">snake_case</button>
        </div>

        <div>
          <label htmlFor="output-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Output
          </label>
          <div className="relative">
            <textarea
              id="output-text"
              readOnly
              value={outputText}
              placeholder="Converted text will appear here..."
              rows={6}
              className="w-full p-2.5 font-sans text-base border rounded-lg resize-y bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-text select-all"
            />
            <div className="absolute top-3 right-3">
              <CopyButton valueToCopy={outputText} ariaLabel="Copy converted text" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}