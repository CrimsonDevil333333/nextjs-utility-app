'use client';

import { useState, useMemo } from 'react';
import { ArrowDown, Check, Award } from 'lucide-react';

const ItemInput = ({ id, item, setItem }: { id: string, item: any, setItem: (item: any) => void }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Item {id}</h3>
    <div>
      <label htmlFor={`price-${id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
      <input 
        id={`price-${id}`}
        type="number"
        value={item.price}
        onChange={e => setItem({ ...item, price: e.target.value })}
        className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
        placeholder="0.00"
      />
    </div>
    <div className="flex gap-4">
      <div className="w-1/2">
        <label htmlFor={`quantity-${id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
        <input 
          id={`quantity-${id}`}
          type="number"
          value={item.quantity}
          onChange={e => setItem({ ...item, quantity: e.target.value })}
          className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., 12"
        />
      </div>
      <div className="w-1/2">
        <label htmlFor={`unit-${id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
        <input 
          id={`unit-${id}`}
          type="text"
          value={item.unit}
          onChange={e => setItem({ ...item, unit: e.target.value })}
          className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., oz"
        />
      </div>
    </div>
  </div>
);

const UnitPriceCalculatorPage = () => {
  const [itemA, setItemA] = useState({ price: '', quantity: '', unit: 'oz' });
  const [itemB, setItemB] = useState({ price: '', quantity: '', unit: 'oz' });

  const { unitPriceA, unitPriceB, winner } = useMemo(() => {
    const pA = parseFloat(itemA.price);
    const qA = parseFloat(itemA.quantity);
    const pB = parseFloat(itemB.price);
    const qB = parseFloat(itemB.quantity);

    const upA = qA > 0 ? pA / qA : 0;
    const upB = qB > 0 ? pB / qB : 0;
    
    let win = null;
    if (upA > 0 && upB > 0) {
      if (upA < upB) win = 'A';
      else if (upB < upA) win = 'B';
      else win = 'TIE';
    }

    return {
      unitPriceA: upA,
      unitPriceB: upB,
      winner: win,
    };
  }, [itemA, itemB]);

  const ResultCard = ({ id, unitPrice, unit, isWinner }: { id: string, unitPrice: number, unit: string, isWinner: boolean }) => (
    <div className={`p-4 rounded-lg transition-all ${isWinner ? 'bg-green-100 dark:bg-green-900/50 border-2 border-green-500' : 'bg-gray-100 dark:bg-gray-800'}`}>
      <h4 className="font-bold text-gray-600 dark:text-gray-300">Item {id} Unit Price</h4>
      <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
        ${unitPrice > 0 ? unitPrice.toFixed(4) : '0.00'}
        {unit && <span className="text-lg font-semibold text-gray-500 dark:text-gray-400"> / {unit}</span>}
      </p>
      {isWinner && <div className="mt-2 text-green-600 dark:text-green-300 font-bold flex items-center"><Award className="w-5 h-5 mr-1" /> Best Value!</div>}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Unit Price Calculator 🛒</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Compare two items to find the best value.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ItemInput id="A" item={itemA} setItem={setItemA} />
        <ItemInput id="B" item={itemB} setItem={setItemB} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-center mb-4">Results</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <ResultCard id="A" unitPrice={unitPriceA} unit={itemA.unit} isWinner={winner === 'A' || winner === 'TIE'} />
            <ResultCard id="B" unitPrice={unitPriceB} unit={itemB.unit} isWinner={winner === 'B' || winner === 'TIE'} />
        </div>
        {winner === 'TIE' && <p className="text-center mt-4 font-semibold text-blue-600 dark:text-blue-400">It's a tie! Both items have the same unit price.</p>}
      </div>
    </div>
  );
};

export default UnitPriceCalculatorPage;
