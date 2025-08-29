'use client';

import { useState, useMemo, useEffect } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Configuration for supported currencies ---
const CURRENCIES = {
    USD: { code: 'USD', symbol: '$', locale: 'en-US' },
    INR: { code: 'INR', symbol: '₹', locale: 'en-IN' },
    EUR: { code: 'EUR', symbol: '€', locale: 'de-DE' },
};

const CompoundInterestCalculatorPage = () => {
    const [principal, setPrincipal] = useState<string>('10000');
    const [rate, setRate] = useState<string>('7');
    const [years, setYears] = useState<string>('10');
    const [monthlyContribution, setMonthlyContribution] = useState<string>('500');
    const [currencyCode, setCurrencyCode] = useState<keyof typeof CURRENCIES>('USD');
    const currency = CURRENCIES[currencyCode];

    const { futureValue, totalInterest, totalContribution, chartData } = useMemo(() => {
        const P = parseFloat(principal);
        const r = parseFloat(rate) / 100 / 12;
        const t = parseFloat(years);
        const n = 12;
        const PMT = parseFloat(monthlyContribution);

        const data = [];

        if (P >= 0 && r > 0 && t > 0) {
            for (let i = 1; i <= t; i++) {
                const nt = n * i;
                const fvPrincipal = P * Math.pow(1 + r, nt);
                const fvContributions = PMT * ((Math.pow(1 + r, nt) - 1) / r);
                const total = fvPrincipal + fvContributions;
                const contributions = P + (PMT * nt);
                const interest = total - contributions;
                data.push({
                    year: `Year ${i}`,
                    principal: P,
                    contributions: contributions - P,
                    interest: interest,
                });
            }

            const finalNt = n * t;
            const finalFvPrincipal = P * Math.pow(1 + r, finalNt);
            const finalFvContributions = PMT * ((Math.pow(1 + r, finalNt) - 1) / r);
            const finalTotal = finalFvPrincipal + finalFvContributions;
            const finalTotalContributions = P + (PMT * finalNt);
            const finalInterest = finalTotal - finalTotalContributions;

            return {
                futureValue: finalTotal.toLocaleString(currency.locale, { style: 'currency', currency: currency.code }),
                totalInterest: finalInterest.toLocaleString(currency.locale, { style: 'currency', currency: currency.code }),
                totalContribution: finalTotalContributions.toLocaleString(currency.locale, { style: 'currency', currency: currency.code }),
                chartData: data,
            };
        }
        return { futureValue: `${currency.symbol}0.00`, totalInterest: `${currency.symbol}0.00`, totalContribution: `${currency.symbol}0.00`, chartData: [] };
    }, [principal, rate, years, monthlyContribution, currency]);

    return (
        <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Compound Interest Calculator 📈</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Visualize your investment growth over time.</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="principal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Principal ({currency.symbol})</label>
                            <input type="number" id="principal" value={principal} onFocus={triggerHapticFeedback} onChange={(e) => { setPrincipal(e.target.value); triggerHapticFeedback(); }} className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                            <label htmlFor="rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Annual Interest Rate (%)</label>
                            <input type="number" id="rate" value={rate} onFocus={triggerHapticFeedback} onChange={(e) => { setRate(e.target.value); triggerHapticFeedback(); }} className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                            <label htmlFor="years" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Investment Term (Years)</label>
                            <input type="number" id="years" value={years} onFocus={triggerHapticFeedback} onChange={(e) => { setYears(e.target.value); triggerHapticFeedback(); }} className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                            <label htmlFor="monthly" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Contribution ({currency.symbol})</label>
                            <input type="number" id="monthly" value={monthlyContribution} onFocus={triggerHapticFeedback} onChange={(e) => { setMonthlyContribution(e.target.value); triggerHapticFeedback(); }} className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white">Investment Projection</h2>
                        <div className="mt-4 p-6 bg-green-50 dark:bg-green-900/50 rounded-lg text-center">
                            <p className="text-lg text-gray-600 dark:text-gray-300">Future Value</p>
                            <p className="text-4xl sm:text-5xl font-extrabold my-2 text-green-600 dark:text-green-400">{futureValue}</p>
                        </div>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Contributions</p>
                                <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">{totalContribution}</p>
                            </div>
                            <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Interest Earned</p>
                                <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">{totalInterest}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-center mb-4">Growth Over Time</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} stackOffset="sign">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="principal" stackId="a" fill="#8884d8" />
                                <Bar dataKey="contributions" stackId="a" fill="#82ca9d" />
                                <Bar dataKey="interest" stackId="a" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompoundInterestCalculatorPage;
