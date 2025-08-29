'use client';

import { useState, useMemo, useEffect } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Configuration for supported currencies ---
const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', locale: 'en-US', max: 1000000, step: 1000, default: '200000' },
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN', max: 20000000, step: 10000, default: '1500000' },
  EUR: { code: 'EUR', symbol: '€', locale: 'de-DE', max: 1000000, step: 1000, default: '200000' },
};

// A helper component to reduce repetition for the input/slider combo
const InputSlider = ({ label, unit, value, onChange, min, max, step }: any) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <label htmlFor={label} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{unit}{Number(value).toLocaleString()}</span>
    </div>
    <input
      type="range"
      id={label}
      min={min}
      max={max}
      step={step}
      value={value}
      onFocus={triggerHapticFeedback}
      onChange={(e) => { onChange(e); triggerHapticFeedback(); }}
      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
    />
  </div>
);

const LoanCalculatorPage = () => {
  const [currencyCode, setCurrencyCode] = useState<keyof typeof CURRENCIES>('USD');
  const currency = CURRENCIES[currencyCode];

  const [values, setValues] = useState({
    loanAmount: currency.default,
    interestRate: '8.5',
    loanTerm: '20',
  });

  useEffect(() => {
    setValues(prev => ({ ...prev, loanAmount: CURRENCIES[currencyCode].default }));
  }, [currencyCode]);

  const { monthlyPayment, totalPayment, totalInterest, principalPercentage, interestPercentage } = useMemo(() => {
    const P = parseFloat(values.loanAmount);
    const r = parseFloat(values.interestRate) / 100 / 12;
    const n = parseFloat(values.loanTerm) * 12;

    if (P > 0 && r > 0 && n > 0) {
      const M = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = M * n;
      const interest = total - P;
      const principalPercent = (P / total) * 100;
      const interestPercent = (interest / total) * 100;

      const formatOptions: Intl.NumberFormatOptions = { style: 'currency', currency: currency.code };

      return {
        monthlyPayment: M.toLocaleString(currency.locale, formatOptions),
        totalPayment: total.toLocaleString(currency.locale, formatOptions),
        totalInterest: interest.toLocaleString(currency.locale, formatOptions),
        principalPercentage: principalPercent,
        interestPercentage: interestPercent
      };
    }
    return { monthlyPayment: `${currency.symbol}0.00`, totalPayment: `${currency.symbol}0.00`, totalInterest: `${currency.symbol}0.00`, principalPercentage: 100, interestPercentage: 0 };
  }, [values, currency]);

  const handleValueChange = (field: keyof typeof values, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Loan Calculator 🏦</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Estimate your monthly loan payments.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <select
              value={currencyCode}
              onFocus={triggerHapticFeedback}
              onChange={(e) => { setCurrencyCode(e.target.value as keyof typeof CURRENCIES); triggerHapticFeedback(); }}
              className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            >
              {Object.keys(CURRENCIES).map(code => (
                <option key={code} value={code}>{code} ({CURRENCIES[code as keyof typeof CURRENCIES].symbol})</option>
              ))}
            </select>
          </div>

          <div className="space-y-6">
            <InputSlider
              label="Loan Amount"
              unit={currency.symbol}
              value={values.loanAmount}
              onChange={(e: any) => handleValueChange('loanAmount', e.target.value)}
              min="1000" max={currency.max} step={currency.step}
            />
            <InputSlider
              label="Annual Interest Rate"
              unit="%"
              value={values.interestRate}
              onChange={(e: any) => handleValueChange('interestRate', e.target.value)}
              min="0.1" max="25" step="0.1"
            />
            <InputSlider
              label="Loan Term"
              unit=" years"
              value={values.loanTerm}
              onChange={(e: any) => handleValueChange('loanTerm', e.target.value)}
              min="1" max="40" step="1"
            />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white">Results</h2>
            <div className="mt-4 p-6 bg-blue-50 dark:bg-blue-900/50 rounded-lg space-y-4">
              <div className="flex justify-between items-baseline">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200">Monthly Payment:</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{monthlyPayment}</p>
              </div>

              <div className="pt-4">
                <div className="w-full flex h-4 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600">
                  <div className="bg-blue-500" style={{ width: `${principalPercentage}%`, transition: 'width 0.4s ease-in-out' }}></div>
                  <div className="bg-red-500" style={{ width: `${interestPercentage}%`, transition: 'width 0.4s ease-in-out' }}></div>
                </div>
                <div className="flex justify-between mt-2 text-xs font-medium">
                  <span className="text-blue-600 dark:text-blue-400">Principal: {principalPercentage.toFixed(1)}%</span>
                  <span className="text-red-600 dark:text-red-400">Interest: {interestPercentage.toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <p className="text-md text-gray-600 dark:text-gray-300">Total Payment:</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{totalPayment}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-md text-gray-600 dark:text-gray-300">Total Interest Paid:</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{totalInterest}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculatorPage;
