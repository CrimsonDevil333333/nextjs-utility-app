'use client';

import { useState, useMemo, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Award, Plus, X } from 'lucide-react';

// --- Types and Constants ---
const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', locale: 'en-US' },
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN' },
  EUR: { code: 'EUR', symbol: '€', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB' },
  JPY: { code: 'JPY', symbol: '¥', locale: 'ja-JP' },
};

interface Item {
  id: number;
  price: string;
  quantity: string;
  unit: string;
}

// --- Reusable Components ---

const ItemInput = ({ item, setItem, removeItem }: { item: Item, setItem: (item: Item) => void, removeItem: () => void }) => (
  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border dark:border-gray-700 relative">
    <button onClick={removeItem} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"><X size={16} /></button>
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Item {item.id}</h3>
    <div className="space-y-4">
      <div>
        <label htmlFor={`price-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
        <input
          id={`price-${item.id}`}
          type="number"
          value={item.price}
          onFocus={triggerHapticFeedback}
          onChange={e => { setItem({ ...item, price: e.target.value }); triggerHapticFeedback(); }}
          className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
        />
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <label htmlFor={`quantity-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
          <input
            id={`quantity-${item.id}`}
            type="number"
            value={item.quantity}
            onFocus={triggerHapticFeedback}
            onChange={e => { setItem({ ...item, quantity: e.target.value }); triggerHapticFeedback(); }}
            className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 12"
          />
        </div>
        <div className="w-1/2">
          <label htmlFor={`unit-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
          <input
            id={`unit-${item.id}`}
            type="text"
            value={item.unit}
            onFocus={triggerHapticFeedback}
            onChange={e => { setItem({ ...item, unit: e.target.value }); triggerHapticFeedback(); }}
            className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., oz"
          />
        </div>
      </div>
    </div>
  </div>
);

const UnitPriceCalculatorPage = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, price: '', quantity: '', unit: 'oz' },
    { id: 2, price: '', quantity: '', unit: 'oz' }
  ]);
  const [currencyCode, setCurrencyCode] = useState<keyof typeof CURRENCIES>('USD');
  const currency = CURRENCIES[currencyCode];

  const results = useMemo(() => {
    const calculated = items.map(item => {
      const price = parseFloat(item.price);
      const quantity = parseFloat(item.quantity);
      const unitPrice = quantity > 0 ? price / quantity : 0;
      return { ...item, unitPrice };
    });

    const bestValue = calculated.reduce((best, current) => {
      if (current.unitPrice > 0 && (best.unitPrice === 0 || current.unitPrice < best.unitPrice)) {
        return current;
      }
      return best;
    }, { unitPrice: 0, id: -1 });

    return { calculated, bestValueId: bestValue.id };
  }, [items]);

  const handleSetItem = (updatedItem: Item) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleAddItem = () => {
    triggerHapticFeedback();
    setItems([...items, { id: Date.now(), price: '', quantity: '', unit: 'oz' }]);
  };

  const handleRemoveItem = (id: number) => {
    triggerHapticFeedback();
    setItems(items.filter(item => item.id !== id));
  };

  const handleReset = () => {
    triggerHapticFeedback();
    setItems([
      { id: 1, price: '', quantity: '', unit: 'oz' },
      { id: 2, price: '', quantity: '', unit: 'oz' }
    ]);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code }).format(value);

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Unit Price Calculator 🛒</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Compare items to find the best value.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
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
            <button onClick={handleReset} className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md">Reset</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map(item => (
              <ItemInput key={item.id} item={item} setItem={handleSetItem} removeItem={() => handleRemoveItem(item.id)} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button onClick={handleAddItem} className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900">
              <Plus size={16} /> Add Another Item
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-center mb-4">Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {results.calculated.map(item => (
                <div key={item.id} className={`p-4 rounded-lg transition-all ${results.bestValueId === item.id ? 'bg-green-100 dark:bg-green-900/50 border-2 border-green-500' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <h4 className="font-bold text-gray-600 dark:text-gray-300">Item {item.id} Unit Price</h4>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                    {formatCurrency(item.unitPrice)}
                    {item.unit && <span className="text-lg font-semibold text-gray-500 dark:text-gray-400"> / {item.unit}</span>}
                  </p>
                  {results.bestValueId === item.id && <div className="mt-2 text-green-600 dark:text-green-300 font-bold flex items-center"><Award className="w-5 h-5 mr-1" /> Best Value!</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitPriceCalculatorPage;
