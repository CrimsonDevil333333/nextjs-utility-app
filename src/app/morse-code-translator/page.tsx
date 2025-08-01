'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRightLeft } from 'lucide-react';
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

// --- Morse Code Logic ---

const morseCode: { [key: string]: string } = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
    'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
    'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
};

const textCode = Object.fromEntries(Object.entries(morseCode).map(([k, v]) => [v, k]));

const MorseCodeTranslatorPage = () => {
    const [input, setInput] = useState('Hello World');
    const [output, setOutput] = useState('');
    const [isMorseToText, setIsMorseToText] = useState(false);

    useEffect(() => {
        if (isMorseToText) {
            const translated = input.split(' ').map(code => textCode[code] || '').join('');
            setOutput(translated);
        } else {
            const translated = input.toUpperCase().split('').map(char => morseCode[char] || '').join(' ');
            setOutput(translated);
        }
    }, [input, isMorseToText]);

    const handleSwap = () => {
        triggerHapticFeedback();
        setIsMorseToText(prev => !prev);
        setInput(output);
        setOutput(input);
    };

    return (
        <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Morse Code Translator</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Translate text to Morse code and vice versa.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
                    <div>
                        <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {isMorseToText ? "Morse Code Input" : "Text Input"}
                        </label>
                        <textarea
                            id="input-text"
                            value={input}
                            onFocus={triggerHapticFeedback}
                            onChange={(e) => { setInput(e.target.value); triggerHapticFeedback(); }}
                            placeholder={isMorseToText ? "e.g., .... . .-.. .-.. ---" : "Enter Text"}
                            rows={4}
                            className="w-full p-3 border rounded-md font-mono dark:bg-gray-900 dark:border-gray-600 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleSwap}
                            title="Swap translation direction"
                            className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            <ArrowRightLeft className="w-5 h-5" />
                        </button>
                    </div>

                    <div>
                        <label htmlFor="output-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {isMorseToText ? "Text Output" : "Morse Code Output"}
                        </label>
                        <div className="relative">
                            <textarea
                                id="output-text"
                                value={output}
                                readOnly
                                placeholder="Translation will appear here..."
                                rows={4}
                                className="w-full p-3 border rounded-md font-mono bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 resize-y pr-24"
                            />
                            <div className="absolute top-3 right-3">
                                <CopyButton valueToCopy={output} ariaLabel="Copy translation" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MorseCodeTranslatorPage;
