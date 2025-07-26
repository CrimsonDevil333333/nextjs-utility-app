'use client';

import { useState, useMemo } from 'react';

const units = {
  length: { name: 'Length', base: 'meters', items: { meters: 1, kilometers: 1000, miles: 1609.34, feet: 0.3048, centimeters: 0.01, millimeters: 0.001, inches: 0.0254, yards: 0.9144 } },
  weight: { name: 'Weight', base: 'grams', items: { grams: 1, kilograms: 1000, pounds: 453.592, ounces: 28.3495, milligrams: 0.001, metric_tons: 1_000_000, short_tons: 907185, stones: 6350.29 } },
  volume: { name: 'Volume', base: 'liters', items: { liters: 1, milliliters: 0.001, cubic_meters: 1000, gallons: 3.78541, quarts: 0.946353, pints: 0.473176, cups: 0.236588 } },
  temperature: { name: 'Temperature', base: 'celsius', items: { celsius: 1, fahrenheit: (temp: number) => (temp - 32) * 5/9, kelvin: (temp: number) => temp - 273.15 } },
};

// Add specific handling for temperature as it's not a direct multiplication factor
type UnitItem = number | ((temp: number) => number);

// Extend the units definition to properly type `items`
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
    const newCategory = e.target.value as Category;
    setCategory(newCategory);
    const newUnits = Object.keys(typedUnits[newCategory].items);
    setFromUnit(newUnits[0]);
    setToUnit(newUnits[1] || newUnits[0]); // Ensure 'toUnit' has a fallback if only one unit exists
  };

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '...';

    const currentCategory = typedUnits[category];

    if (category === 'temperature') {
      const fromFunc = currentCategory.items[fromUnit];
      const toFunc = currentCategory.items[toUnit];
      let tempInCelsius: number;

      // Convert 'from' unit to Celsius
      if (typeof fromFunc === 'function') {
        // This means it's a conversion FROM fahrenheit/kelvin TO celsius
        if (fromUnit === 'fahrenheit') tempInCelsius = (value - 32) * 5/9;
        else if (fromUnit === 'kelvin') tempInCelsius = value - 273.15;
        else tempInCelsius = value; // Should not happen with current setup for 'celsius' as base
      } else {
        tempInCelsius = value; // If 'fromUnit' is celsius, value is already in celsius
      }

      // Convert from Celsius to 'to' unit
      let convertedTemp: number;
      if (typeof toFunc === 'function') {
        // This means it's a conversion FROM celsius TO fahrenheit/kelvin
        if (toUnit === 'fahrenheit') convertedTemp = (tempInCelsius * 9/5) + 32;
        else if (toUnit === 'kelvin') convertedTemp = tempInCelsius + 273.15;
        else convertedTemp = tempInCelsius; // Should not happen
      } else {
        convertedTemp = tempInCelsius; // If 'toUnit' is celsius
      }
      return convertedTemp.toLocaleString(undefined, { maximumFractionDigits: 4 });

    } else {
      // Standard linear conversion for length, weight, volume
      const fromFactor = currentCategory.items[fromUnit] as number;
      const toFactor = currentCategory.items[toUnit] as number;

      const valueInBaseUnit = value * fromFactor;
      const convertedValue = valueInBaseUnit / toFactor;

      return convertedValue.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }
  }, [inputValue, fromUnit, toUnit, category]);

  const unitOptions = Object.keys(typedUnits[category].items);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Metric Converter</h1>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              className="
                block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 /* Base border */
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2.5 pl-3 pr-10
                focus:outline-none focus:ring-2 focus:ring-blue-500 /* Added ring for focus */
                dark:focus:ring-blue-400 transition-all duration-200 ease-in-out
                cursor-pointer text-base
              "
            >
              {Object.entries(typedUnits).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
            {/* Custom Dropdown Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 dark:text-gray-300">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          {/* From Input and Select */}
          <div className="col-span-1">
            <label htmlFor="from-value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From Value</label>
            <input
              id="from-value"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="
                w-full rounded-md border border-gray-300 dark:border-gray-600 /* Base border */
                bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2.5 px-3
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 /* Added ring and border for focus */
                dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all duration-200 ease-in-out
                text-base
              "
            />
            <div className="relative mt-3">
              <select
                id="from-unit"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="
                  block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 /* Base border */
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2.5 pl-3 pr-10
                  focus:outline-none focus:ring-2 focus:ring-blue-500 /* Added ring for focus */
                  dark:focus:ring-blue-400 transition-all duration-200 ease-in-out
                  cursor-pointer text-base
                "
              >
                {unitOptions.map(u => <option key={u} value={u}>{u.replace(/_/g, ' ')}</option>)}
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 dark:text-gray-300">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Equals Sign */}
          <div className="text-center text-3xl font-bold text-gray-600 dark:text-gray-400 flex items-center justify-center h-full sm:col-span-1">
            =
          </div>

          {/* To Output and Select */}
          <div className="col-span-1">
            <label htmlFor="to-value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Converted Value</label>
            <div
              id="to-value"
              className="
                w-full rounded-md border border-gray-300 dark:border-gray-600 /* Base border */
                bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2.5 px-3
                font-mono text-lg font-semibold
                flex items-center justify-between min-h-[42px]
                transition-all duration-200 ease-in-out
              "
            >
              {result}
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">{toUnit.replace(/_/g, ' ')}</span>
            </div>
            <div className="relative mt-3">
              <select
                id="to-unit"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="
                  block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 /* Base border */
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2.5 pl-3 pr-10
                  focus:outline-none focus:ring-2 focus:ring-blue-500 /* Added ring for focus */
                  dark:focus:ring-blue-400 transition-all duration-200 ease-in-out
                  cursor-pointer text-base
                "
              >
                {unitOptions.map(u => <option key={u} value={u}>{u.replace(/_/g, ' ')}</option>)}
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
      </div>
    </div>
  );
}