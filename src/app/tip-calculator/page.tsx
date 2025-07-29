'use client';

import { useState, useMemo } from 'react';

const TipCalculatorPage = () => {
    const [bill, setBill] = useState<string>('');
    const [tipPercent, setTipPercent] = useState<string>('15');
    const [people, setPeople] = useState<string>('1');

    const { tipAmount, totalAmount, perPersonAmount } = useMemo(() => {
        const billAmount = parseFloat(bill);
        const tip = parseFloat(tipPercent);
        const numPeople = parseInt(people, 10);

        if (billAmount > 0 && tip >= 0 && numPeople > 0) {
            const tipValue = billAmount * (tip / 100);
            const totalValue = billAmount + tipValue;
            const perPersonValue = totalValue / numPeople;
            return {
                tipAmount: tipValue.toFixed(2),
                totalAmount: totalValue.toFixed(2),
                perPersonAmount: perPersonValue.toFixed(2)
            };
        }
        return { tipAmount: '0.00', totalAmount: '0.00', perPersonAmount: '0.00' };
    }, [bill, tipPercent, people]);

    const tipOptions = [10, 15, 20, 25];

    return (
        <div className="max-w-lg mx-auto p-4 sm:p-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-800 dark:text-white">Tip Calculator 🧾</h1>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="bill" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bill Amount</label>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input type="number" id="bill" value={bill} onChange={(e) => setBill(e.target.value)} className="pl-7 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0.00" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Tip %</label>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {tipOptions.map(opt => (
                                <button key={opt} onClick={() => setTipPercent(String(opt))} className={`py-2 px-4 rounded-md font-semibold transition ${tipPercent === String(opt) ? 'bg-indigo-600 text-white' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'}`}>
                                    {opt}%
                                </button>
                            ))}
                        </div>
                         <input type="number" value={tipPercent} onChange={(e) => setTipPercent(e.target.value)} className="mt-2 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Custom Tip %" />
                    </div>

                    <div>
                        <label htmlFor="people" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of People</label>
                        <input type="number" id="people" value={people} onChange={(e) => setPeople(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>

                <div className="mt-8 p-6 bg-indigo-900 text-white rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                        <p>Tip Amount <span className="text-sm text-indigo-300">/ person</span></p>
                        <p className="text-2xl sm:text-3xl font-bold">${(parseFloat(tipAmount) / parseInt(people, 10) || 0).toFixed(2)}</p>
                    </div>
                     <div className="flex justify-between items-center">
                        <p>Total <span className="text-sm text-indigo-300">/ person</span></p>
                        <p className="text-4xl sm:text-5xl font-extrabold">${perPersonAmount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TipCalculatorPage;