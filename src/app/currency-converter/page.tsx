'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';

const API_URL = 'https://api.frankfurter.app/latest';

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json() as { base: string; rates: { [key: string]: number } };
        setRates({ [data.base]: 1, ...data.rates });
      } catch (error) {
        console.error("Failed to fetch rates:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRates();
  }, []);

  const allCurrencyOptions = Object.keys(rates).sort();

  const filteredFromCurrencyOptions = useMemo(() => {
    if (!fromSearch) return allCurrencyOptions;
    return allCurrencyOptions.filter(c => c.toLowerCase().includes(fromSearch.toLowerCase()));
  }, [fromSearch, allCurrencyOptions]);

  const filteredToCurrencyOptions = useMemo(() => {
    if (!toSearch) return allCurrencyOptions;
    return allCurrencyOptions.filter(c => c.toLowerCase().includes(toSearch.toLowerCase()));
  }, [toSearch, allCurrencyOptions]);

  const { convertedAmount, exchangeRate } = useMemo(() => {
    const value = parseFloat(amount);
    if (isNaN(value) || !rates[fromCurrency] || !rates[toCurrency]) return { convertedAmount: '...', exchangeRate: '...' };

    const valueInBase = value / rates[fromCurrency];
    const converted = valueInBase * rates[toCurrency];
    const rate = (1 / rates[fromCurrency]) * rates[toCurrency];

    return {
      convertedAmount: converted.toLocaleString(undefined, { maximumFractionDigits: 4 }),
      exchangeRate: `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`
    };
  }, [amount, fromCurrency, toCurrency, rates]);

  const handleReverse = useCallback(() => {
    triggerHapticFeedback();
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  const handleReset = () => {
    triggerHapticFeedback();
    setAmount('1');
    setFromCurrency('USD');
    setToCurrency('EUR');
    setFromSearch('');
    setToSearch('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-center text-lg text-gray-700 dark:text-gray-300">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading currency data...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Currency Converter</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Convert currencies with live exchange rates.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div>
              <label htmlFor="from-curr-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From</label>
              <input id="from-curr-amount" type="number" value={amount} onFocus={triggerHapticFeedback} onChange={(e) => { setAmount(e.target.value); triggerHapticFeedback(); }} className="w-full rounded-md border p-3 bg-gray-50 dark:bg-gray-900 dark:border-gray-600" />
              <select value={fromCurrency} onFocus={triggerHapticFeedback} onChange={(e) => { setFromCurrency(e.target.value); triggerHapticFeedback(); }} className="mt-2 w-full rounded-md border p-3 bg-white dark:bg-gray-700 dark:border-gray-600">
                {allCurrencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex justify-center my-4 md:my-0">
              <button onClick={handleReverse} className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-transform hover:scale-110 md:rotate-0 rotate-90">
                <ArrowRightLeft size={20} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To</label>
              <div className="w-full rounded-md border p-3 bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 font-mono text-lg font-semibold min-h-[48px] flex items-center">
                {convertedAmount}
              </div>
              <select value={toCurrency} onFocus={triggerHapticFeedback} onChange={(e) => { setToCurrency(e.target.value); triggerHapticFeedback(); }} className="mt-2 w-full rounded-md border p-3 bg-white dark:bg-gray-700 dark:border-gray-600">
                {allCurrencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="text-center mt-6 font-semibold text-gray-600 dark:text-gray-400">{exchangeRate}</div>
          <div className="mt-6 flex justify-center">
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
              <RefreshCw size={16} /> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
