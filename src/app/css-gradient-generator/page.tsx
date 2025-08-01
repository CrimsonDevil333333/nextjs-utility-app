'use client';

import { useState, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

// Reusable CopyButton component with haptic feedback
function CopyButton({ valueToCopy, ariaLabel }: { valueToCopy: string; ariaLabel: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        if (valueToCopy) {
            try {
                await navigator.clipboard.writeText(valueToCopy);
                setCopied(true);
                triggerHapticFeedback(); // Haptic feedback on successful copy
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

const CSSGradientGeneratorPage = () => {
    const [color1, setColor1] = useState('#ff0000');
    const [color2, setColor2] = useState('#0000ff');
    const [angle, setAngle] = useState(90);

    const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">CSS Gradient Generator</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Create and preview linear gradients in real-time.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Controls Panel */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Controls</h2>

                    {/* Color Pickers */}
                    <div className="flex items-center justify-around">
                        <div className="text-center">
                            <label htmlFor="color1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color 1</label>
                            <input id="color1" type="color" value={color1} onFocus={triggerHapticFeedback} onChange={(e) => { setColor1(e.target.value); triggerHapticFeedback(); }} className="w-20 h-20 p-1 border-none rounded-full cursor-pointer" />
                        </div>
                        <div className="text-center">
                            <label htmlFor="color2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color 2</label>
                            <input id="color2" type="color" value={color2} onFocus={triggerHapticFeedback} onChange={(e) => { setColor2(e.target.value); triggerHapticFeedback(); }} className="w-20 h-20 p-1 border-none rounded-full cursor-pointer" />
                        </div>
                    </div>

                    {/* Angle Slider */}
                    <div>
                        <label htmlFor="angle" className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Angle: {angle}°</label>
                        <input id="angle" type="range" min="0" max="360" value={angle} onFocus={triggerHapticFeedback} onChange={(e) => { setAngle(Number(e.target.value)); triggerHapticFeedback(); }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                    </div>

                    {/* CSS Output */}
                    <div>
                        <label htmlFor="css-output" className="block font-medium text-gray-700 dark:text-gray-300 mb-2">CSS Code</label>
                        <div className="flex items-center gap-2">
                            <input id="css-output" type="text" value={gradient} readOnly className="w-full p-2.5 border rounded-md font-mono bg-gray-100 dark:bg-gray-900 dark:border-gray-600" />
                            <CopyButton valueToCopy={gradient} ariaLabel="Copy CSS gradient code" />
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="h-80 w-full rounded-lg shadow-lg border border-gray-200 dark:border-gray-700" style={{ background: gradient }}></div>
            </div>
        </div>
    );
};

export default CSSGradientGeneratorPage;
