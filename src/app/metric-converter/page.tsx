'use client';

import { useState, useMemo, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Configuration for supported units ---
const units = {
  length: { name: 'Length', base: 'meters', items: { meters: 1, kilometers: 1000, miles: 1609.34, feet: 0.3048, centimeters: 0.01, millimeters: 0.001, inches: 0.0254, yards: 0.9144 } },
  weight: { name: 'Weight', base: 'grams', items: { grams: 1, kilograms: 1000, pounds: 453.592, ounces: 28.3495, milligrams: 0.001, metric_tons: 1_000_000, short_tons: 907185, stones: 6350.29 } },
  volume: { name: 'Volume', base: 'liters', items: { liters: 1, milliliters: 0.001, cubic_meters: 1000, gallons: 3.78541, quarts: 0.946353, pints: 0.473176, cups: 0.236588 } },
  temperature: { name: 'Temperature', base: 'celsius', items: { celsius: 1, fahrenheit: (temp: number) => (temp - 32) * 5 / 9, kelvin: (temp: number) => temp - 273.15 } },
};

type UnitItem = number | ((temp: number) => number);

interface UnitCategory {
  name: string;
  base: string;
  items: { [key: string]: UnitItem };
}

type Categories = { [key: string]: UnitCategory };
const typedUnits: Categories = units;

type Category = keyof typeof typedUnits;

export default function MetricConverterPage() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('kilometers');
  const [inputValue, setInputValue] = useState('1');

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    triggerHapticFeedback();
    const newCategory = e.target.value as Category;
    setCategory(newCategory);
    const newUnits = Object.keys(typedUnits[newCategory].items);
    setFromUnit(newUnits[0]);
    setToUnit(newUnits[1] || newUnits[0]);
  };

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '...';

    const currentCategory = typedUnits[category];

    if (category === 'temperature') {
      const fromFunc = currentCategory.items[fromUnit];
      let tempInCelsius: number;

      if (typeof fromFunc === 'function') {
        if (fromUnit === 'fahrenheit') tempInCelsius = (value - 32) * 5 / 9;
        else if (fromUnit === 'kelvin') tempInCelsius = value - 273.15;
        else tempInCelsius = value;
      } else {
        tempInCelsius = value;
      }

      const toFunc = currentCategory.items[toUnit];
      let convertedTemp: number;
      if (typeof toFunc === 'function') {
        if (toUnit === 'fahrenheit') convertedTemp = (tempInCelsius * 9 / 5) + 32;
        else if (toUnit === 'kelvin') convertedTemp = tempInCelsius + 273.15;
        else convertedTemp = tempInCelsius;
      } else {
        convertedTemp = tempInCelsius;
      }
      return convertedTemp.toLocaleString(undefined, { maximumFractionDigits: 4 });

    } else {
      const fromFactor = currentCategory.items[fromUnit] as number;
      const toFactor = currentCategory.items[toUnit] as number;
      const valueInBaseUnit = value * fromFactor;
      const convertedValue = valueInBaseUnit / toFactor;
      return convertedValue.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }
  }, [inputValue, fromUnit, toUnit, category]);

  const unitOptions = Object.keys(typedUnits[category].items);

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Unit Converter</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Convert between various units of measurement.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <div className="relative">
              <select
                id="category"
                value={category}
                onFocus={triggerHapticFeedback}
                onChange={handleCategoryChange}
                className="block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-base"
              >
                {Object.entries(typedUnits).map(([key, { name }]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 dark:text-gray-300">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            <div className="col-span-1">
              <label htmlFor="from-value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From</label>
              <input
                id="from-value"
                type="number"
                value={inputValue}
                onFocus={triggerHapticFeedback}
                onChange={(e) => { setInputValue(e.target.value); triggerHapticFeedback(); }}
                placeholder="Enter value"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
              <div className="relative mt-3">
                <select
                  id="from-unit"
                  value={fromUnit}
                  onFocus={triggerHapticFeedback}
                  onChange={(e) => { setFromUnit(e.target.value); triggerHapticFeedback(); }}
                  className="block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-base"
                >
                  {unitOptions.map(u => <option key={u} value={u}>{u.replace(/_/g, ' ')}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 dark:text-gray-300">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>
            </div>

            <div className="text-center text-3xl font-bold text-gray-600 dark:text-gray-400 flex items-center justify-center h-full sm:col-span-1">
              =
            </div>

            <div className="col-span-1">
              <label htmlFor="to-value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To</label>
              <div
                id="to-value"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 py-2.5 px-3 font-mono text-lg font-semibold flex items-center justify-between min-h-[42px]"
              >
                {result}
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">{toUnit.replace(/_/g, ' ')}</span>
              </div>
              <div className="relative mt-3">
                <select
                  id="to-unit"
                  value={toUnit}
                  onFocus={triggerHapticFeedback}
                  onChange={(e) => { setToUnit(e.target.value); triggerHapticFeedback(); }}
                  className="block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-base"
                >
                  {unitOptions.map(u => <option key={u} value={u}>{u.replace(/_/g, ' ')}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 dark:text-gray-300">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
