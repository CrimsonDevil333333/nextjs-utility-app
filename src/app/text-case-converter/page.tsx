'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
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

export default function TextCaseConverterPage() {
  const [inputText, setInputText] = useState('Hello World, this is a test string.');
  const [outputText, setOutputText] = useState('');
  const [activeCase, setActiveCase] = useState('sentence');

  const toSentenceCase = (str: string) => !str ? '' : str.toLowerCase().replace(/(^\s*\w|[.?!]\s*\w)/g, (c) => c.toUpperCase());
  const toTitleCase = (str: string) => !str ? '' : str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  const toCamelCase = (str: string) => !str ? '' : str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
  const toPascalCase = (str: string) => !str ? '' : str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
  const toKebabCase = (str: string) => !str ? '' : str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase().replace(/\s+/g, '-');
  const toSnakeCase = (str: string) => !str ? '' : str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2').toLowerCase().replace(/\s+/g, '_');

  const handleCaseConversion = useCallback((caseType: string) => {
    triggerHapticFeedback();
    setActiveCase(caseType);
    let convertedText = '';
    switch (caseType) {
      case 'sentence': convertedText = toSentenceCase(inputText); break;
      case 'lower': convertedText = inputText.toLowerCase(); break;
      case 'upper': convertedText = inputText.toUpperCase(); break;
      case 'title': convertedText = toTitleCase(inputText); break;
      case 'camel': convertedText = toCamelCase(inputText); break;
      case 'pascal': convertedText = toPascalCase(inputText); break;
      case 'kebab': convertedText = toKebabCase(inputText); break;
      case 'snake': convertedText = toSnakeCase(inputText); break;
      default: convertedText = inputText;
    }
    setOutputText(convertedText);
  }, [inputText]);

  useEffect(() => {
    handleCaseConversion(activeCase);
  }, [inputText, activeCase, handleCaseConversion]);

  const handleClear = useCallback(() => {
    triggerHapticFeedback();
    setInputText('');
    setOutputText('');
  }, []);

  const stats = useMemo(() => {
    const words = inputText.trim().split(/\s+/).filter(Boolean).length;
    const chars = inputText.length;
    const lines = inputText.split('\n').length;
    return { words, chars, lines };
  }, [inputText]);

  const caseButtons = [
    { id: 'sentence', label: 'Sentence Case' },
    { id: 'lower', label: 'lowercase' },
    { id: 'upper', label: 'UPPERCASE' },
    { id: 'title', label: 'Title Case' },
    { id: 'camel', label: 'camelCase' },
    { id: 'pascal', label: 'PascalCase' },
    { id: 'kebab', label: 'kebab-case' },
    { id: 'snake', label: 'snake_case' },
  ];

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Text Case Converter</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Convert text between different case formats instantly.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input Text</label>
            <div className="relative">
              <textarea
                id="input-text"
                value={inputText}
                onFocus={triggerHapticFeedback}
                onChange={(e) => { setInputText(e.target.value); triggerHapticFeedback(); }}
                placeholder="Enter text here..."
                rows={6}
                className="w-full p-3 font-sans text-base border rounded-lg resize-y bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {inputText && (
                <button onClick={handleClear} className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md">Clear</button>
              )}
            </div>
            <div className="flex justify-end gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>Characters: {stats.chars}</span>
              <span>Words: {stats.words}</span>
              <span>Lines: {stats.lines}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6">
            {caseButtons.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleCaseConversion(id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out shadow-sm ${activeCase === id ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600 dark:text-gray-200'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="output-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output</label>
            <div className="relative">
              <textarea
                id="output-text"
                readOnly
                value={outputText}
                placeholder="Converted text will appear here..."
                rows={6}
                className="w-full p-3 font-sans text-base border rounded-lg resize-y bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-text select-all"
              />
              <div className="absolute top-3 right-3">
                <CopyButton valueToCopy={outputText} ariaLabel="Copy converted text" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
