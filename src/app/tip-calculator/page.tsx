'use client';

import { useState, useMemo, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Users, DollarSign } from 'lucide-react';

// --- Configuration for supported currencies ---
const CURRENCIES = {
    USD: { code: 'USD', symbol: '$', locale: 'en-US' },
    INR: { code: 'INR', symbol: '₹', locale: 'en-IN' },
    EUR: { code: 'EUR', symbol: '€', locale: 'de-DE' },
};

const TipCalculatorPage = () => {
    const [bill, setBill] = useState<string>('');
    const [tipPercent, setTipPercent] = useState<string>('15');
    const [people, setPeople] = useState<string>('1');
    const [currencyCode, setCurrencyCode] = useState<keyof typeof CURRENCIES>('USD');
    const currency = CURRENCIES[currencyCode];

    const { tipAmount, totalAmount, perPersonAmount } = useMemo(() => {
        const billAmount = parseFloat(bill);
        const tip = parseFloat(tipPercent);
        const numPeople = parseInt(people, 10);

        if (billAmount > 0 && tip >= 0 && numPeople > 0) {
            const tipValue = billAmount * (tip / 100);
            const totalValue = billAmount + tipValue;
            const perPersonValue = totalValue / numPeople;
            return {
                tipAmount: tipValue,
                totalAmount: totalValue,
                perPersonAmount: perPersonValue
            };
        }
        return { tipAmount: 0, totalAmount: 0, perPersonAmount: 0 };
    }, [bill, tipPercent, people]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currency.code,
        }).format(value);
    };

    const handleReset = useCallback(() => {
        triggerHapticFeedback();
        setBill('');
        setTipPercent('15');
        setPeople('1');
    }, []);

    const tipOptions = [10, 15, 20, 25];

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-lg mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Tip Calculator 🧾</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Calculate tips and split bills with ease.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="bill" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bill Amount</label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500 sm:text-sm">{currency.symbol}</span>
                                </div>
                                <input type="number" id="bill" value={bill} onFocus={triggerHapticFeedback} onChange={(e) => { setBill(e.target.value); triggerHapticFeedback(); }} className="pl-7 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0.00" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Tip %</label>
                            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {tipOptions.map(opt => (
                                    <button key={opt} onClick={() => { setTipPercent(String(opt)); triggerHapticFeedback(); }} className={`py-2 px-4 rounded-md font-semibold transition ${tipPercent === String(opt) ? 'bg-indigo-600 text-white' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'}`}>
                                        {opt}%
                                    </button>
                                ))}
                            </div>
                            <input type="number" value={tipPercent} onFocus={triggerHapticFeedback} onChange={(e) => { setTipPercent(e.target.value); triggerHapticFeedback(); }} className="mt-2 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Custom Tip %" />
                        </div>

                        <div>
                            <label htmlFor="people" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of People</label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Users size={16} className="text-gray-500" />
                                </div>
                                <input type="number" id="people" value={people} onFocus={triggerHapticFeedback} onChange={(e) => { setPeople(e.target.value); triggerHapticFeedback(); }} className="pl-10 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-indigo-900 text-white rounded-xl space-y-4">
                        <div className="flex justify-between items-center">
                            <p>Tip Amount <span className="text-sm text-indigo-300">/ person</span></p>
                            <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(tipAmount / (parseInt(people) || 1))}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p>Total <span className="text-sm text-indigo-300">/ person</span></p>
                            <p className="text-4xl sm:text-5xl font-extrabold">{formatCurrency(perPersonAmount)}</p>
                        </div>
                        <div className="pt-4 border-t border-indigo-700 flex justify-between items-center">
                            <p>Total Bill</p>
                            <p className="text-xl font-semibold">{formatCurrency(totalAmount)}</p>
                        </div>
                        <button onClick={handleReset} className="w-full mt-4 py-3 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600 transition-colors">Reset</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TipCalculatorPage;
