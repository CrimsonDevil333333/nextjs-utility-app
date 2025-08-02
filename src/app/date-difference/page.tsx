'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { differenceInDays, differenceInBusinessDays, format, addDays, addMonths, addYears, isValid, parseISO, differenceInCalendarMonths, differenceInCalendarYears } from 'date-fns';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, X, Calendar, Hash } from 'lucide-react';

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

  return (
    <button
      onClick={handleCopy}
      disabled={!valueToCopy}
      className={`p-2 rounded-md transition-all duration-200 ease-in-out ${!valueToCopy ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

type CalculatorType = 'difference' | 'addSubtract';
type UnitType = 'days' | 'months' | 'years';

export default function DateDifferenceCalculatorPage() {
  const [calcType, setCalcType] = useState<CalculatorType>('difference');
  const [startDateDiff, setStartDateDiff] = useState<string>('');
  const [endDateDiff, setEndDateDiff] = useState<string>('');
  const [includeWeekends, setIncludeWeekends] = useState(true);
  const [baseDateAddSub, setBaseDateAddSub] = useState<string>('');
  const [durationValue, setDurationValue] = useState('1');
  const [durationUnit, setDurationUnit] = useState<UnitType>('days');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDateDiff(today);
    setEndDateDiff(today);
    setBaseDateAddSub(today);
  }, [calcType]);

  const detailedDiffResult = useMemo(() => {
    const start = parseISO(startDateDiff);
    const end = parseISO(endDateDiff);

    if (!isValid(start) || !isValid(end)) return { totalDays: 0, businessDays: 0, detailed: 'Invalid Date(s)' };

    const totalDays = differenceInDays(end, start);
    const businessDays = differenceInBusinessDays(end, start);

    let years = differenceInCalendarYears(end, start);
    let months = differenceInCalendarMonths(end, start) % 12;
    let days = differenceInDays(end, addMonths(addYears(start, years), months));

    if (days < 0) {
      months -= 1;
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      days = differenceInDays(end, addMonths(addYears(start, years), months));
    }

    return {
      totalDays,
      businessDays,
      detailed: `${years}y ${months}m ${days}d`
    };
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
    } else {
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
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Date Calculator</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Calculate the difference between dates or add/subtract days.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
              <button onClick={() => { setCalcType('difference'); triggerHapticFeedback(); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${calcType === 'difference' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Date Difference</button>
              <button onClick={() => { setCalcType('addSubtract'); triggerHapticFeedback(); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${calcType === 'addSubtract' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Add/Subtract</button>
            </div>
          </div>

          {calcType === 'difference' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-date-diff" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                  <input type="date" id="start-date-diff" value={startDateDiff} onFocus={triggerHapticFeedback} onChange={(e) => { setStartDateDiff(e.target.value); triggerHapticFeedback(); }} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                  <label htmlFor="end-date-diff" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                  <input type="date" id="end-date-diff" value={endDateDiff} onFocus={triggerHapticFeedback} onChange={(e) => { setEndDateDiff(e.target.value); triggerHapticFeedback(); }} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                <h3 className="font-bold text-center mb-2">Result</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><p className="text-2xl font-bold">{detailedDiffResult.totalDays}</p><p className="text-xs">Total Days</p></div>
                  <div><p className="text-2xl font-bold">{detailedDiffResult.businessDays}</p><p className="text-xs">Business Days</p></div>
                  <div><p className="text-2xl font-bold">{detailedDiffResult.detailed}</p><p className="text-xs">Detailed</p></div>
                </div>
              </div>
            </div>
          )}

          {calcType === 'addSubtract' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="base-date-addsub" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Base Date</label>
                <input type="date" id="base-date-addsub" value={baseDateAddSub} onFocus={triggerHapticFeedback} onChange={(e) => { setBaseDateAddSub(e.target.value); triggerHapticFeedback(); }} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <select value={operation} onFocus={triggerHapticFeedback} onChange={(e) => { setOperation(e.target.value as 'add' | 'subtract'); triggerHapticFeedback(); }} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <option value="add">Add</option>
                  <option value="subtract">Subtract</option>
                </select>
                <input type="number" value={durationValue} onFocus={triggerHapticFeedback} onChange={(e) => { setDurationValue(e.target.value); triggerHapticFeedback(); }} className="w-24 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" min="0" />
                <select value={durationUnit} onFocus={triggerHapticFeedback} onChange={(e) => { setDurationUnit(e.target.value as UnitType); triggerHapticFeedback(); }} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Date</label>
                <div className="relative">
                  <input type="text" readOnly value={addSubtractResult} className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2"><CopyButton valueToCopy={addSubtractResult} ariaLabel="Copy calculated date" /></div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button onClick={handleClear} className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}
