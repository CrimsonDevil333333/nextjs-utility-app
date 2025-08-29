'use client';

import { useState, useCallback } from 'react';
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

const NumberBaseConverterPage = () => {
    const [decimal, setDecimal] = useState('10');
    const [binary, setBinary] = useState('1010');
    const [hex, setHex] = useState('A');
    const [octal, setOctal] = useState('12');

    const updateValues = (val: string, base: number) => {
        const num = parseInt(val, base);
        if (!isNaN(num)) {
            setDecimal(num.toString(10));
            setBinary(num.toString(2));
            setHex(num.toString(16).toUpperCase());
            setOctal(num.toString(8));
        }
    };

    const handleDecimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDecimal(val);
        updateValues(val, 10);
    };

    const handleBinaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setBinary(val);
        updateValues(val, 2);
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setHex(val);
        updateValues(val, 16);
    };

    const handleOctalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setOctal(val);
        updateValues(val, 8);
    };

    const handleFocus = () => triggerHapticFeedback();
    const handleChange = (handler: (e: React.ChangeEvent<HTMLInputElement>) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        triggerHapticFeedback();
        handler(e);
    };

    return (
        <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Number Base Converter</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Convert numbers between decimal, binary, hexadecimal, and octal.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
                    <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Decimal</label>
                        <div className="relative">
                            <input type="text" value={decimal} onFocus={handleFocus} onChange={handleChange(handleDecimalChange)} className="w-full p-3 border rounded-md font-mono dark:bg-gray-900 dark:border-gray-600 pr-24" />
                            <div className="absolute top-1/2 -translate-y-1/2 right-3">
                                <CopyButton valueToCopy={decimal} ariaLabel="Copy Decimal" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Binary</label>
                        <div className="relative">
                            <input type="text" value={binary} onFocus={handleFocus} onChange={handleChange(handleBinaryChange)} className="w-full p-3 border rounded-md font-mono dark:bg-gray-900 dark:border-gray-600 pr-24" />
                            <div className="absolute top-1/2 -translate-y-1/2 right-3">
                                <CopyButton valueToCopy={binary} ariaLabel="Copy Binary" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Hexadecimal</label>
                        <div className="relative">
                            <input type="text" value={hex} onFocus={handleFocus} onChange={handleChange(handleHexChange)} className="w-full p-3 border rounded-md font-mono dark:bg-gray-900 dark:border-gray-600 pr-24" />
                            <div className="absolute top-1/2 -translate-y-1/2 right-3">
                                <CopyButton valueToCopy={hex} ariaLabel="Copy Hexadecimal" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Octal</label>
                        <div className="relative">
                            <input type="text" value={octal} onFocus={handleFocus} onChange={handleChange(handleOctalChange)} className="w-full p-3 border rounded-md font-mono dark:bg-gray-900 dark:border-gray-600 pr-24" />
                            <div className="absolute top-1/2 -translate-y-1/2 right-3">
                                <CopyButton valueToCopy={octal} ariaLabel="Copy Octal" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NumberBaseConverterPage;
