'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { differenceInDays, differenceInMonths, differenceInYears, parseISO, addDays, addMonths, addYears, isValid } from 'date-fns';
import { triggerHapticFeedback } from '@/utils/haptics';

// Reusable CopyButton component
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

type CalculatorType = 'difference' | 'addSubtract';
type UnitType = 'days' | 'months' | 'years';

export default function DateDifferenceCalculatorPage() {
  const [calcType, setCalcType] = useState<CalculatorType>('difference');

  // State for difference calculation
  const [startDateDiff, setStartDateDiff] = useState<string>('');
  const [endDateDiff, setEndDateDiff] = useState<string>('');

  // State for add/subtract calculation
  const [baseDateAddSub, setBaseDateAddSub] = useState<string>('');
  const [durationValue, setDurationValue] = useState('1');
  const [durationUnit, setDurationUnit] = useState<UnitType>('days');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');

  useEffect(() => {
    // Set current date for initial load or mode switch
    const today = new Date().toISOString().split('T')[0];
    setStartDateDiff(today);
    setEndDateDiff(today);
    setBaseDateAddSub(today);
  }, [calcType]);

  const diffResult = useMemo(() => {
    const start = parseISO(startDateDiff);
    const end = parseISO(endDateDiff);

    if (!isValid(start) || !isValid(end)) return 'Invalid Date(s)';

    const totalDays = differenceInDays(end, start);

    return `Difference: ${totalDays} day${Math.abs(totalDays) !== 1 ? 's' : ''}`;
  }, [startDateDiff, endDateDiff]);

  const addSubtractResult = useMemo(() => {
    const base = parseISO(baseDateAddSub);
    const value = parseInt(durationValue);

    if (!isValid(base) || isNaN(value)) return 'Invalid Input';

    let newDate: Date;
    if (operation === 'add') {
      if (durationUnit === 'days') newDate = addDays(base, value);
      else if (durationUnit === 'months') newDate = addMonths(base, value);
      else newDate = addYears(base, value);
    } else { // subtract
      if (durationUnit === 'days') newDate = addDays(base, -value);
      else if (durationUnit === 'months') newDate = addMonths(base, -value);
      else newDate = addYears(base, -value);
    }

    return isValid(newDate) ? newDate.toISOString().split('T')[0] : 'Error Calculating';
  }, [baseDateAddSub, durationValue, durationUnit, operation]);

  const handleClear = useCallback(() => {
    triggerHapticFeedback();
    const today = new Date().toISOString().split('T')[0];
    setStartDateDiff(today);
    setEndDateDiff(today);
    setBaseDateAddSub(today);
    setDurationValue('1');
    setOperation('add');
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Date Difference & Calculator</h1>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        {/* Type Switch */}
        <div className="flex justify-center mb-6">
          <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
            <button
              onClick={() => { setCalcType('difference'); triggerHapticFeedback(); }}
              className={`
                                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                                ${calcType === 'difference'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
                            `}
            >
              Date Difference
            </button>
            <button
              onClick={() => { setCalcType('addSubtract'); triggerHapticFeedback(); }}
              className={`
                                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                                ${calcType === 'addSubtract'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
                            `}
            >
              Add/Subtract Days
            </button>
          </div>
        </div>

        {/* Calculator Body */}
        {calcType === 'difference' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-date-diff" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date-diff"
                  value={startDateDiff}
                  onFocus={triggerHapticFeedback}
                  onChange={(e) => { setStartDateDiff(e.target.value); triggerHapticFeedback(); }}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="end-date-diff" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date-diff"
                  value={endDateDiff}
                  onFocus={triggerHapticFeedback}
                  onChange={(e) => { setEndDateDiff(e.target.value); triggerHapticFeedback(); }}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="diff-result" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Result
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="diff-result"
                  readOnly
                  value={diffResult}
                  className="w-full p-2.5 pr-28 border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default"
                  placeholder="Difference in days"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <CopyButton valueToCopy={diffResult} ariaLabel="Copy difference result" />
                </div>
              </div>
            </div>
          </div>
        )}

        {calcType === 'addSubtract' && (
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="base-date-addsub" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Base Date
              </label>
              <input
                type="date"
                id="base-date-addsub"
                value={baseDateAddSub}
                onFocus={triggerHapticFeedback}
                onChange={(e) => { setBaseDateAddSub(e.target.value); triggerHapticFeedback(); }}
                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={operation}
                onFocus={triggerHapticFeedback}
                onChange={(e) => { setOperation(e.target.value as 'add' | 'subtract'); triggerHapticFeedback(); }}
                className="p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
              </select>
              <input
                type="number"
                value={durationValue}
                onFocus={triggerHapticFeedback}
                onChange={(e) => { setDurationValue(e.target.value); triggerHapticFeedback(); }}
                className="w-24 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Value"
                min="0"
              />
              <select
                value={durationUnit}
                onFocus={triggerHapticFeedback}
                onChange={(e) => { setDurationUnit(e.target.value as UnitType); triggerHapticFeedback(); }}
                className="p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="days">Days</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
            <div>
              <label htmlFor="addsub-result" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="addsub-result"
                  readOnly
                  value={addSubtractResult}
                  className="w-full p-2.5 pr-28 border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default"
                  placeholder="Calculated date"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <CopyButton valueToCopy={addSubtractResult} ariaLabel="Copy calculated date" />
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
