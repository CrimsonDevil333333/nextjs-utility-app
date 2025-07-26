// app/random-generator/page.tsx
'use client';

import { useState, useCallback, useMemo, useEffect } from 'react'; // Import useEffect

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

type GeneratorType = 'number' | 'password';

export default function RandomGeneratorPage() {
  const [type, setType] = useState<GeneratorType>('number');

  // Random Number State
  const [minNum, setMinNum] = useState('1');
  const [maxNum, setMaxNum] = useState('100');
  const [randomNumber, setRandomNumber] = useState('');

  // Password Generator State
  const [passwordLength, setPasswordLength] = useState('16');
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const generateRandomNumber = useCallback(() => {
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
    // Ensure at least one of each selected type is included (if possible given length)
    const requiredChars = [];
    if (includeUppercase) requiredChars.push(uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]);
    if (includeLowercase) requiredChars.push(lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]);
    if (includeNumbers) requiredChars.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
    if (includeSymbols) requiredChars.push(symbolChars[Math.floor(Math.random() * symbolChars.length)]);

    // Fill the rest of the password length with random chars from available pool
    for (let i = 0; i < length - requiredChars.length; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        password += availableChars[randomIndex];
    }

    // Shuffle in the required characters to ensure they are present
    const finalPasswordArray = (password + requiredChars.join('')).split('');
    for (let i = finalPasswordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalPasswordArray[i], finalPasswordArray[j]] = [finalPasswordArray[j], finalPasswordArray[i]];
    }
    setGeneratedPassword(finalPasswordArray.join(''));

  }, [passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const handleClear = useCallback(() => {
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

  // Use useEffect to generate initial values and re-generate on type switch
  useEffect(() => {
    if (type === 'number') {
      generateRandomNumber();
    } else {
      generatePassword();
    }
  }, [type, generateRandomNumber, generatePassword]); // Add dependencies

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Random Generator</h1>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        {/* Type Switch */}
        <div className="flex justify-center mb-6">
          <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
            <button
              onClick={() => setType('number')} // No direct generation here, useEffect handles it
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                ${type === 'number'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              Random Number
            </button>
            <button
              onClick={() => setType('password')} // No direct generation here, useEffect handles it
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                ${type === 'password'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              Password Generator
            </button>
          </div>
        </div>

        {/* Generator Body */}
        {type === 'number' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label htmlFor="min-num" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min
                </label>
                <input
                  type="number"
                  id="min-num"
                  value={minNum}
                  onChange={(e) => setMinNum(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min"
                />
              </div>
              <div>
                <label htmlFor="max-num" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max
                </label>
                <input
                  type="number"
                  id="max-num"
                  value={maxNum}
                  onChange={(e) => setMaxNum(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max"
                />
              </div>
              <button
                onClick={generateRandomNumber}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow transition-colors duration-200 ease-in-out"
              >
                Generate
              </button>
            </div>
            {/* Corrected positioning for result input + copy button */}
            <div> {/* This div wraps label and input+button for better grouping */}
                <label htmlFor="random-num-result" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Result
                </label>
                <div className="relative flex items-center"> {/* Added flex and relative */}
                    <input
                        type="text"
                        id="random-num-result"
                        readOnly
                        value={randomNumber}
                        className="flex-grow p-2.5 font-mono text-base border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default select-all pr-16" // Added pr-16 for copy button
                        placeholder="Generated number"
                    />
                    <div className="absolute right-0 top-0 h-full flex items-center pr-2"> {/* Positioning for the copy button within the input */}
                        <CopyButton valueToCopy={randomNumber} ariaLabel="Copy random number" />
                    </div>
                </div>
            </div>
          </div>
        )}

        {type === 'password' && (
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="password-length" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password Length
              </label>
              <input
                type="number"
                id="password-length"
                value={passwordLength}
                onChange={(e) => setPasswordLength(e.target.value)}
                min="1"
                max="128"
                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                Uppercase (A-Z)
              </label>
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                Lowercase (a-z)
              </label>
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                Numbers (0-9)
              </label>
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                Symbols (!@#$)
              </label>
            </div>
            <button
              onClick={generatePassword}
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow transition-colors duration-200 ease-in-out"
            >
              Generate Password
            </button>
            {/* Corrected positioning for result input + copy button */}
            <div> {/* This div wraps label and input+button for better grouping */}
                <label htmlFor="generated-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Generated Password
                </label>
                <div className="relative flex items-center"> {/* Added flex and relative */}
                    <input
                        type="text"
                        id="generated-password"
                        readOnly
                        value={generatedPassword}
                        className="flex-grow p-2.5 font-mono text-base border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default select-all pr-16" // Added pr-16 for copy button
                        placeholder="Your secure password"
                    />
                    <div className="absolute right-0 top-0 h-full flex items-center pr-2"> {/* Positioning for the copy button within the input */}
                        <CopyButton valueToCopy={generatedPassword} ariaLabel="Copy generated password" />
                    </div>
                </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
            <button
                onClick={handleClear}
                className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                aria-label="Reset fields"
                title="Reset Fields"
            >
                Reset
            </button>
        </div>
      </div>
    </div>
  );
}