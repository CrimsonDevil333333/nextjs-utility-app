'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { History, X } from 'lucide-react';

const ScientificCalculatorPage = () => {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    const handleButtonClick = useCallback((value: string) => {
        triggerHapticFeedback();
        if (showHistory) setShowHistory(false);

        if (value === 'C') {
            setDisplay('0');
            setExpression('');
        } else if (value === 'DEL') {
            if (display !== 'Error' && display.length > 1) {
                setDisplay(display.slice(0, -1));
                setExpression(prev => prev.slice(0, -1));
            } else {
                setDisplay('0');
                setExpression('');
            }
        } else if (value === '=') {
            if (display === 'Error') return;
            try {
                const sanitizedExpression = expression.replace(/\^/g, '**').replace(/%/g, '/100');
                // eslint-disable-next-line no-eval
                const result = eval(sanitizedExpression);
                const resultString = String(result);
                setDisplay(resultString);
                setExpression(resultString);
                setHistory(prev => [...prev, `${expression} = ${resultString}`].slice(-10));
            } catch {
                setDisplay('Error');
                setExpression('');
            }
        } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(value)) {
            try {
                const num = parseFloat(display);
                let result;
                switch (value) {
                    case 'sin': result = Math.sin(num * Math.PI / 180); break;
                    case 'cos': result = Math.cos(num * Math.PI / 180); break;
                    case 'tan': result = Math.tan(num * Math.PI / 180); break;
                    case 'log': result = Math.log10(num); break;
                    case 'ln': result = Math.log(num); break;
                    case 'sqrt': result = Math.sqrt(num); break;
                }
                const formattedResult = String(Number(result?.toFixed(10)));
                setDisplay(formattedResult);
                setExpression(formattedResult);
            } catch {
                setDisplay('Error');
            }
        } else {
            if (display === '0' || display === 'Error') {
                setDisplay(value);
                setExpression(value);
            } else {
                setDisplay(display + value);
                setExpression(expression + value);
            }
        }
    }, [display, expression, showHistory]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            if (e.key >= '0' && e.key <= '9' || "()".includes(e.key)) handleButtonClick(e.key);
            if (['+', '-', '*', '/', '^', '%'].includes(e.key)) handleButtonClick(e.key);
            if (e.key === 'Enter' || e.key === '=') handleButtonClick('=');
            if (e.key === 'Backspace') handleButtonClick('DEL');
            if (e.key === 'Escape') handleButtonClick('C');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleButtonClick]);

    const handleHistoryClick = (item: string) => {
        triggerHapticFeedback();
        const result = item.split(' = ')[1];
        setDisplay(result);
        setExpression(result);
        setShowHistory(false);
    };

    const buttons = [
        'C', 'DEL', 'sqrt', '^', '%',
        'sin', 'cos', 'tan', '(', ')',
        '7', '8', '9', 'ln', '/',
        '4', '5', '6', 'log', '*',
        '1', '2', '3', '.', '-',
        '0', '=', '+',
    ];

    const getButtonClass = (btn: string) => {
        const isNumber = !isNaN(parseInt(btn)) || btn === '.';
        const isOperator = ['/', '*', '-', '+', '^', '%'].includes(btn);
        const isFunction = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', '(', ')'].includes(btn);

        if (btn === 'C' || btn === 'DEL') return 'bg-red-400/20 dark:bg-red-900/50 text-red-500 dark:text-red-400';
        if (btn === '=') return 'col-span-2 bg-blue-600 hover:bg-blue-700 text-white';
        if (isOperator) return 'bg-blue-400/20 dark:bg-blue-900/50 text-blue-500 dark:text-blue-400';
        if (isFunction) return 'bg-gray-500/10 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300';
        if (isNumber) return 'bg-gray-500/5 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200';
        return 'bg-gray-200 dark:bg-gray-700';
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-sm mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Scientific Calculator 🔬</h1>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4 relative">
                    <div className="bg-gray-200 dark:bg-gray-900/50 text-gray-900 dark:text-white text-right rounded-lg p-4 h-24 flex flex-col justify-end overflow-hidden relative">
                        {showHistory ? (
                            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 flex flex-col rounded-lg">
                                <div className="flex justify-between items-center mb-1 px-2">
                                    <h3 className="font-bold text-left">History</h3>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => { setHistory([]); triggerHapticFeedback(); }} className="text-xs text-blue-500 hover:underline">Clear</button>
                                        <button onClick={() => { setShowHistory(false); triggerHapticFeedback(); }} className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                                <ul className="space-y-1 text-sm text-right h-full overflow-y-auto pr-2">
                                    {history.length > 0 ? history.map((item, index) => (
                                        <li key={index} className="truncate cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded px-1" onClick={() => handleHistoryClick(item)}>{item}</li>
                                    )).reverse() : <li className="text-gray-400 text-center pt-4">No history yet</li>}
                                </ul>
                            </div>
                        ) : (
                            <>
                                <button onClick={() => { setShowHistory(true); triggerHapticFeedback(); }} className="absolute top-2 left-2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                                    <History size={20} />
                                </button>
                                <span className="text-gray-500 dark:text-gray-400 text-sm break-all">{expression || ' '}</span>
                                <span className={`font-bold break-all transition-all ${display.length > 10 ? 'text-3xl' : 'text-4xl'}`}>{display}</span>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-5 gap-2 sm:gap-3">
                        {buttons.map((btn) => (
                            <button
                                key={btn}
                                onClick={() => handleButtonClick(btn)}
                                className={`p-3 sm:p-4 rounded-lg text-lg sm:text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform active:scale-95 ${getButtonClass(btn)} ${btn === '0' ? 'col-span-2' : ''}`}
                            >
                                {btn}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScientificCalculatorPage;
