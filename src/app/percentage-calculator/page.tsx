'use client';

import { useState, useMemo, useCallback, ChangeEvent } from 'react';
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

type CalculationType = 'percentOfNumber' | 'whatPercentIs' | 'percentIncreaseDecrease';

export default function PercentageCalculatorPage() {
  const [type, setType] = useState<CalculationType>('percentOfNumber');
  const [percentX, setPercentX] = useState('10');
  const [numberY, setNumberY] = useState('100');
  const [numberX, setNumberX] = useState('50');
  const [numberY2, setNumberY2] = useState('200');
  const [oldValue, setOldValue] = useState('100');
  const [newValue, setNewValue] = useState('120');

  const handleClear = useCallback(() => {
    triggerHapticFeedback();
    setPercentX('10');
    setNumberY('100');
    setNumberX('50');
    setNumberY2('200');
    setOldValue('100');
    setNewValue('120');
  }, []);

  const result1 = useMemo(() => {
    const x = parseFloat(percentX);
    const y = parseFloat(numberY);
    if (isNaN(x) || isNaN(y)) return '';
    return ((x / 100) * y).toFixed(2);
  }, [percentX, numberY]);

  const result2 = useMemo(() => {
    const x = parseFloat(numberX);
    const y = parseFloat(numberY2);
    if (isNaN(x) || isNaN(y) || y === 0) return '';
    return ((x / y) * 100).toFixed(2);
  }, [numberX, numberY2]);

  const result3 = useMemo(() => {
    const oldVal = parseFloat(oldValue);
    const newVal = parseFloat(newValue);
    if (isNaN(oldVal) || isNaN(newVal) || oldVal === 0) return '';
    const change = newVal - oldVal;
    const percentage = (change / oldVal) * 100;
    const formatted = percentage.toFixed(2);
    if (percentage > 0) return `+${formatted}% Increase`;
    if (percentage < 0) return `${formatted}% Decrease`;
    return 'No Change (0%)';
  }, [oldValue, newValue]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      triggerHapticFeedback();
      const value = e.target.value;
      if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
        setter(value);
      }
    };

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Percentage Calculator</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Calculate percentages with ease.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
              <button
                onClick={() => { setType('percentOfNumber'); triggerHapticFeedback(); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${type === 'percentOfNumber' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                % of Number
              </button>
              <button
                onClick={() => { setType('whatPercentIs'); triggerHapticFeedback(); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${type === 'whatPercentIs' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                What % Is
              </button>
              <button
                onClick={() => { setType('percentIncreaseDecrease'); triggerHapticFeedback(); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${type === 'percentIncreaseDecrease' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                % Change
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {type === 'percentOfNumber' && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <input type="text" value={percentX} onChange={handleInputChange(setPercentX)} onFocus={triggerHapticFeedback} className="w-full sm:w-28 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 10" />
                <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">% of</span>
                <input type="text" value={numberY} onChange={handleInputChange(setNumberY)} onFocus={triggerHapticFeedback} className="w-full sm:w-28 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 100" />
                <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">is</span>
                <div className="flex-grow relative">
                  <input type="text" readOnly value={result1} className="w-full p-2.5 border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default" placeholder="Result" />
                  <div className="absolute top-1/2 -translate-y-1/2 right-3"><CopyButton valueToCopy={result1} ariaLabel="Copy result" /></div>
                </div>
              </div>
            )}

            {type === 'whatPercentIs' && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">What % is</span>
                <input type="text" value={numberX} onChange={handleInputChange(setNumberX)} onFocus={triggerHapticFeedback} className="w-full sm:w-28 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 50" />
                <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">of</span>
                <input type="text" value={numberY2} onChange={handleInputChange(setNumberY2)} onFocus={triggerHapticFeedback} className="w-full sm:w-28 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 200" />
                <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">?</span>
                <div className="flex-grow relative">
                  <input type="text" readOnly value={result2 ? `${result2}%` : ''} className="w-full p-2.5 border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default" placeholder="Result" />
                  <div className="absolute top-1/2 -translate-y-1/2 right-3"><CopyButton valueToCopy={result2 ? `${result2}%` : ''} ariaLabel="Copy result" /></div>
                </div>
              </div>
            )}

            {type === 'percentIncreaseDecrease' && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">From</span>
                <input type="text" value={oldValue} onChange={handleInputChange(setOldValue)} onFocus={triggerHapticFeedback} className="w-full sm:w-28 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Old Value" />
                <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">to</span>
                <input type="text" value={newValue} onChange={handleInputChange(setNewValue)} onFocus={triggerHapticFeedback} className="w-full sm:w-28 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="New Value" />
                <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">is</span>
                <div className="flex-grow relative">
                  <input type="text" readOnly value={result3} className="w-full p-2.5 border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default" placeholder="Result" />
                  <div className="absolute top-1/2 -translate-y-1/2 right-3"><CopyButton valueToCopy={result3} ariaLabel="Copy result" /></div>
                </div>
              </div>
            )}
          </div>

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
    </div>
  );
}
