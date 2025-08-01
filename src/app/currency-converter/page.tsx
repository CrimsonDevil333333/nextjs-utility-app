'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

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
        setRates({ [data.base]: 1, ...data.rates }); // Add base currency to rates
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
    const lowerCaseSearch = fromSearch.toLowerCase();
    return allCurrencyOptions.filter(currency =>
      currency.toLowerCase().includes(lowerCaseSearch)
    );
  }, [fromSearch, allCurrencyOptions]);

  const filteredToCurrencyOptions = useMemo(() => {
    if (!toSearch) return allCurrencyOptions;
    const lowerCaseSearch = toSearch.toLowerCase();
    return allCurrencyOptions.filter(currency =>
      currency.toLowerCase().includes(lowerCaseSearch)
    );
  }, [toSearch, allCurrencyOptions]);


  const result = useMemo(() => {
    const value = parseFloat(amount);
    if (isNaN(value) || !rates[fromCurrency] || !rates[toCurrency]) return '...';

    const valueInBase = value / rates[fromCurrency];
    const convertedValue = valueInBase * rates[toCurrency];

    try {
      return convertedValue; // Return raw number for internal calculations
    } catch (e) {
      console.error("Currency conversion error:", e);
      return NaN;
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const displayResult = useMemo(() => {
    if (isNaN(result as number)) return '...';
    try {
      return (result as number).toLocaleString(undefined, { style: 'currency', currency: toCurrency, maximumFractionDigits: 4 });
    } catch (e) {
      console.error("Currency formatting error:", e);
      return (result as number).toLocaleString(undefined, { maximumFractionDigits: 4 });
    }
  }, [result, toCurrency]);


  const handleReverse = useCallback(() => {
    triggerHapticFeedback();
    const currentFrom = fromCurrency;
    const currentTo = toCurrency;
    const currentResultValue = result;

    setFromCurrency(currentTo);
    setToCurrency(currentFrom);

    if (!isNaN(currentResultValue as number)) {
      setAmount((currentResultValue as number).toFixed(4));
    } else {
      setAmount('1');
    }

    setFromSearch('');
    setToSearch('');

  }, [fromCurrency, toCurrency, result]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-center text-lg text-gray-700 dark:text-gray-300">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading currency data...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Currency Converter</h1>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          {/* From Input and Select */}
          <div className="col-span-1">
            <label htmlFor="from-curr-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
            <input
              id="from-curr-amount"
              type="number"
              value={amount}
              onFocus={triggerHapticFeedback}
              onChange={(e) => { setAmount(e.target.value); triggerHapticFeedback(); }}
              placeholder="Enter amount"
              className="
                                w-full rounded-md border border-gray-300 dark:border-gray-600
                                bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2.5 px-3
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all duration-200 ease-in-out
                                text-base
                            "
            />

            {/* From Currency Search Input */}
            <label htmlFor="from-curr-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">Search From Currency</label>
            <input
              id="from-curr-search"
              type="text"
              value={fromSearch}
              onFocus={triggerHapticFeedback}
              onChange={(e) => {
                setFromSearch(e.target.value);
                triggerHapticFeedback();
                if (!e.target.value && !allCurrencyOptions.includes(fromCurrency)) {
                  setFromCurrency('USD');
                }
              }}
              placeholder="e.g., USD, EUR"
              className="
                                    w-full rounded-md border border-gray-300 dark:border-gray-600
                                    bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2.5 px-3
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all duration-200 ease-in-out
                                    text-base
                                "
            />

            <div className="relative mt-3">
              <select
                id="from-curr"
                value={fromCurrency}
                onFocus={triggerHapticFeedback}
                onChange={(e) => { setFromCurrency(e.target.value); triggerHapticFeedback(); }}
                className="
                                    block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600
                                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2.5 pl-3 pr-10
                                    focus:outline-none focus:ring-2 focus:ring-blue-500
                                    dark:focus:ring-blue-400 transition-all duration-200 ease-in-out
                                    cursor-pointer text-base
                                "
              >
                {filteredFromCurrencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 dark:text-gray-300">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Equals Sign & Reverse Button */}
          <div className="text-center flex flex-col justify-center items-center h-full sm:col-span-1">
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">=</div>
            <button
              onClick={handleReverse}
              className="
                                    inline-flex items-center justify-center p-2 rounded-full border border-gray-300 dark:border-gray-600
                                    bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                                    hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                                    dark:focus:ring-blue-400 transition-all duration-200 ease-in-out
                                    w-10 h-10
                                "
              aria-label="Reverse currencies"
            >
              {/* SVG ICON WITH RESPONSIVE ROTATION */}
              <svg
                className="w-5 h-5 rotate-0 sm:rotate-90 transition-transform duration-300" // Apply rotation responsively
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7l4-4m0 0l4 4m-4-4v18"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 17l-4 4m0 0l-4-4m4 4V3"></path>
              </svg>
            </button>
          </div>

          {/* To Output and Select */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Converted Amount</label>
            <div
              className="
                                w-full rounded-md border border-gray-300 dark:border-gray-600
                                bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2.5 px-3
                                font-mono text-lg font-semibold
                                flex items-center justify-between min-h-[42px]
                                transition-all duration-200 ease-in-out
                            "
            >
              {displayResult}
            </div>

            {/* To Currency Search Input */}
            <label htmlFor="to-curr-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">Search To Currency</label>
            <input
              id="to-curr-search"
              type="text"
              value={toSearch}
              onFocus={triggerHapticFeedback}
              onChange={(e) => {
                setToSearch(e.target.value);
                triggerHapticFeedback();
                if (!e.target.value && !allCurrencyOptions.includes(toCurrency)) {
                  setToCurrency('EUR');
                }
              }}
              placeholder="e.g., INR, JPY"
              className="
                                    w-full rounded-md border border-gray-300 dark:border-gray-600
                                    bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2.5 px-3
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all duration-200 ease-in-out
                                    text-base
                                "
            />

            <div className="relative mt-3">
              <select
                value={toCurrency}
                onFocus={triggerHapticFeedback}
                onChange={(e) => { setToCurrency(e.target.value); triggerHapticFeedback(); }}
                className="
                                    block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600
                                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2.5 pl-3 pr-10
                                    focus:outline-none focus:ring-2 focus:ring-blue-500
                                    dark:focus:ring-blue-400 transition-all duration-200 ease-in-out
                                    cursor-pointer text-base
                                "
              >
                {filteredToCurrencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 dark:text-gray-300">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-center mt-4 text-gray-500 dark:text-gray-400">Rates sourced from Frankfurter.app</p>
      </div>
    </div>
  );
}
