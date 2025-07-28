'use client';
import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';

// Morse code dictionary for Text -> Morse
const morseCode: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
};

// Reverse dictionary for Morse -> Text
const textCode = Object.fromEntries(Object.entries(morseCode).map(([k, v]) => [v, k]));

const MorseCodeTranslatorPage = () => {
    const [input, setInput] = useState('Hello World');
    const [output, setOutput] = useState('');
    const [isMorseToText, setIsMorseToText] = useState(false);
    
    const handleTranslate = () => {
        if (isMorseToText) {
            // Translate Morse to Text
            const translated = input.split(' ').map(code => textCode[code] || '').join('');
            setOutput(translated);
        } else {
            // Translate Text to Morse
            const translated = input.toUpperCase().split('').map(char => morseCode[char] || '').join(' ');
            setOutput(translated);
        }
    };

    const handleSwap = () => {
        setIsMorseToText(prev => !prev);
        // Swap the input and output text for convenience
        setInput(output);
        setOutput(input);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-6">Morse Code Translator</h1>
            <div className="space-y-4">
                <textarea 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isMorseToText ? "Enter Morse Code (e.g., .... . .-.. .-.. ---)" : "Enter Text"} 
                    rows={4}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleTranslate} 
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        {isMorseToText ? "Translate to Text" : "Translate to Morse"}
                    </button>
                    <button 
                        onClick={handleSwap}
                        title="Swap translation direction"
                        className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                        <ArrowRightLeft className="w-5 h-5" />
                    </button>
                </div>
                
                <textarea 
                    value={output} 
                    readOnly 
                    placeholder={isMorseToText ? "Text Output" : "Morse Code Output"} 
                    rows={4}
                    className="w-full p-2 border rounded-md font-mono bg-gray-100 dark:bg-gray-800 dark:border-gray-600"
                />
            </div>
        </div>
    );
};

export default MorseCodeTranslatorPage;