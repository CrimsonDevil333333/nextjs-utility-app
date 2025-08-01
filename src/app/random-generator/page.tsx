'use client';

import { useState, useCallback, useMemo, useEffect, ChangeEvent } from 'react';
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

type GeneratorType = 'number' | 'password';

export default function RandomGeneratorPage() {
  const [type, setType] = useState<GeneratorType>('number');
  const [minNum, setMinNum] = useState('1');
  const [maxNum, setMaxNum] = useState('100');
  const [randomNumber, setRandomNumber] = useState('');
  const [passwordLength, setPasswordLength] = useState('16');
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const generateRandomNumber = useCallback(() => {
    triggerHapticFeedback();
    const min = parseFloat(minNum);
    const max = parseFloat(maxNum);
    if (isNaN(min) || isNaN(max) || min > max) {
      setRandomNumber('Invalid Range');
      return;
    }
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    setRandomNumber(String(num));
  }, [minNum, maxNum]);

  const generatePassword = useCallback(() => {
    triggerHapticFeedback();
    const length = parseInt(passwordLength);
    if (isNaN(length) || length <= 0) {
      setGeneratedPassword('Invalid Length');
      return;
    }

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()-_+=[]{}|;:,.<>?';

    let availableChars = '';
    if (includeUppercase) availableChars += uppercaseChars;
    if (includeLowercase) availableChars += lowercaseChars;
    if (includeNumbers) availableChars += numberChars;
    if (includeSymbols) availableChars += symbolChars;

    if (availableChars.length === 0) {
      setGeneratedPassword('Select character types');
      return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * availableChars.length);
      password += availableChars[randomIndex];
    }
    setGeneratedPassword(password);
  }, [passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const handleClear = useCallback(() => {
    triggerHapticFeedback();
    setMinNum('1');
    setMaxNum('100');
    setRandomNumber('');
    setPasswordLength('16');
    setIncludeUppercase(true);
    setIncludeLowercase(true);
    setIncludeNumbers(true);
    setIncludeSymbols(true);
    setGeneratedPassword('');
  }, []);

  useEffect(() => {
    if (type === 'number') {
      generateRandomNumber();
    } else {
      generatePassword();
    }
  }, [type, generateRandomNumber, generatePassword]);

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Random Generator</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Generate random numbers or secure passwords.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
              <button
                onClick={() => { setType('number'); triggerHapticFeedback(); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${type === 'number' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Random Number
              </button>
              <button
                onClick={() => { setType('password'); triggerHapticFeedback(); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${type === 'password' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Password Generator
              </button>
            </div>
          </div>

          {type === 'number' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label htmlFor="min-num" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Min</label>
                  <input type="number" id="min-num" value={minNum} onFocus={triggerHapticFeedback} onChange={(e) => { setMinNum(e.target.value); triggerHapticFeedback(); }} className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Min" />
                </div>
                <div>
                  <label htmlFor="max-num" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max</label>
                  <input type="number" id="max-num" value={maxNum} onFocus={triggerHapticFeedback} onChange={(e) => { setMaxNum(e.target.value); triggerHapticFeedback(); }} className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Max" />
                </div>
                <button onClick={generateRandomNumber} className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow transition-colors duration-200 ease-in-out">Generate</button>
              </div>
              <div>
                <label htmlFor="random-num-result" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Result</label>
                <div className="relative flex items-center">
                  <input type="text" id="random-num-result" readOnly value={randomNumber} className="flex-grow p-2.5 font-mono text-base border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default select-all pr-24" placeholder="Generated number" />
                  <div className="absolute right-0 top-0 h-full flex items-center pr-2"><CopyButton valueToCopy={randomNumber} ariaLabel="Copy random number" /></div>
                </div>
              </div>
            </div>
          )}

          {type === 'password' && (
            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor="password-length" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password Length</label>
                <input type="number" id="password-length" value={passwordLength} onFocus={triggerHapticFeedback} onChange={(e) => { setPasswordLength(e.target.value); triggerHapticFeedback(); }} min="1" max="128" className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center text-gray-700 dark:text-gray-300"><input type="checkbox" checked={includeUppercase} onChange={(e) => { setIncludeUppercase(e.target.checked); triggerHapticFeedback(); }} className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />Uppercase (A-Z)</label>
                <label className="flex items-center text-gray-700 dark:text-gray-300"><input type="checkbox" checked={includeLowercase} onChange={(e) => { setIncludeLowercase(e.target.checked); triggerHapticFeedback(); }} className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />Lowercase (a-z)</label>
                <label className="flex items-center text-gray-700 dark:text-gray-300"><input type="checkbox" checked={includeNumbers} onChange={(e) => { setIncludeNumbers(e.target.checked); triggerHapticFeedback(); }} className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />Numbers (0-9)</label>
                <label className="flex items-center text-gray-700 dark:text-gray-300"><input type="checkbox" checked={includeSymbols} onChange={(e) => { setIncludeSymbols(e.target.checked); triggerHapticFeedback(); }} className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />Symbols (!@#$)</label>
              </div>
              <button onClick={generatePassword} className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow transition-colors duration-200 ease-in-out">Generate Password</button>
              <div>
                <label htmlFor="generated-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Generated Password</label>
                <div className="relative flex items-center">
                  <input type="text" id="generated-password" readOnly value={generatedPassword} className="flex-grow p-2.5 font-mono text-base border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default select-all pr-24" placeholder="Your secure password" />
                  <div className="absolute right-0 top-0 h-full flex items-center pr-2"><CopyButton valueToCopy={generatedPassword} ariaLabel="Copy generated password" /></div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button onClick={handleClear} className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors" aria-label="Reset fields" title="Reset Fields">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}
