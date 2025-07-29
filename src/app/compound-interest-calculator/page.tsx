'use client';

import { useState, useMemo } from 'react';

const CompoundInterestCalculatorPage = () => {
    const [principal, setPrincipal] = useState<string>('10000');
    const [rate, setRate] = useState<string>('7');
    const [years, setYears] = useState<string>('10');
    const [monthlyContribution, setMonthlyContribution] = useState<string>('500');

    const { futureValue, totalInterest, totalContribution } = useMemo(() => {
        const P = parseFloat(principal); // Initial Principal
        const r = parseFloat(rate) / 100 / 12; // Monthly interest rate
        const t = parseFloat(years); // Years
        const n = 12; // Compounded monthly
        const PMT = parseFloat(monthlyContribution); // Monthly contribution

        if (P >= 0 && r > 0 && t > 0) {
            const nt = n * t;
            // Future value of principal
            const fvPrincipal = P * Math.pow(1 + r, nt);
            // Future value of a series (contributions)
            const fvContributions = PMT * ((Math.pow(1 + r, nt) - 1) / r);

            const total = fvPrincipal + fvContributions;
            const totalContributions = P + (PMT * nt);
            const interest = total - totalContributions;

            return {
                futureValue: total.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                totalInterest: interest.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                totalContribution: totalContributions.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
            };
        }
        return { futureValue: '$0.00', totalInterest: '$0.00', totalContribution: '$0.00' };
    }, [principal, rate, years, monthlyContribution]);

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-800 dark:text-white">Compound Interest Calculator 📈</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="principal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Principal ($)</label>
                        <input type="number" id="principal" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label htmlFor="rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Annual Interest Rate (%)</label>
                        <input type="number" id="rate" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label htmlFor="years" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Investment Term (Years)</label>
                        <input type="number" id="years" value={years} onChange={(e) => setYears(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label htmlFor="monthly" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Contribution ($)</label>
                        <input type="number" id="monthly" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white">Investment Projection</h2>
                    <div className="mt-4 p-6 bg-green-50 dark:bg-green-900/50 rounded-lg text-center">
                        <p className="text-lg text-gray-600 dark:text-gray-300">Future Value</p>
                        <p className="text-4xl sm:text-5xl font-extrabold my-2 text-green-600 dark:text-green-400">{futureValue}</p>
                    </div>
                     <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Contributions</p>
                            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">{totalContribution}</p>
                        </div>
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Interest Earned</p>
                            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">{totalInterest}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompoundInterestCalculatorPage;