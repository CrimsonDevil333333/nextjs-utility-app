'use client';

import { useState, useEffect, useCallback } from 'react';

const ScientificCalculatorPage = () => {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');

    const handleButtonClick = useCallback((value: string) => {
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
                // A safer way to handle expressions without full eval risks for this scope
                const sanitizedExpression = expression
                    .replace(/\^/g, '**')
                    .replace(/%/g, '/100');
                // eslint-disable-next-line no-eval
                const result = eval(sanitizedExpression);
                setDisplay(String(result));
                setExpression(String(result));
            } catch {
                setDisplay('Error');
                setExpression('');
            }
        } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(value)) {
            try {
                const num = parseFloat(display);
                let result;
                switch(value) {
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
    }, [display, expression]);

    // Keyboard support
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

    const buttons = [
        'C', 'DEL', 'sqrt', '^', '%',
        'sin', 'cos', 'tan', '(', ')',
        '7', '8', '9', 'ln', '/',
        '4', '5', '6', 'log', '*',
        '1', '2', '3', '.', '-',
        '0', '=', '+',
    ];
    
    // Helper for styling buttons
    const getButtonClass = (btn: string) => {
        const isNumber = !isNaN(parseInt(btn)) || btn === '.';
        const isOperator = ['/', '*', '-', '+', '^', '%'].includes(btn);
        const isFunction = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', '(', ')'].includes(btn);
        
        if (btn === 'C' || btn === 'DEL') return 'bg-red-400/20 dark:bg-red-900/50 text-red-500 dark:text-red-400';
        if (btn === '=') return 'col-span-2 bg-blue-600 hover:bg-blue-700 text-white';
        if (isOperator) return 'bg-blue-400/20 dark:bg-blue-900/50 text-blue-500 dark:text-blue-400';
        if (isFunction) return 'bg-gray-500/10 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300';
        if (isNumber) return 'bg-gray-500/5 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200';
        return 'bg-gray-200 dark:bg-gray-700'; // Default
    };

    return (
        <div className="flex justify-center items-start pt-8 sm:pt-12 min-h-screen">
            <div className="w-full max-w-sm mx-auto bg-gray-100 dark:bg-gray-900/50 rounded-2xl shadow-2xl p-4 space-y-4">
                <h1 className="text-xl font-bold text-center text-gray-700 dark:text-gray-300">Scientific Calculator 🔬</h1>
                <div className="bg-gray-200 dark:bg-gray-800/80 text-gray-900 dark:text-white text-right rounded-lg p-4 h-24 flex flex-col justify-end overflow-hidden">
                    <span className="text-gray-500 dark:text-gray-400 text-sm break-all">{expression || ' '}</span>
                    <span className={`font-bold break-all transition-all ${display.length > 10 ? 'text-3xl' : 'text-4xl'}`}>{display}</span>
                </div>
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {buttons.map((btn) => (
                        <button
                            key={btn}
                            onClick={() => handleButtonClick(btn)}
                            className={`
                                p-3 sm:p-4 rounded-lg text-lg sm:text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                transition-transform active:scale-95
                                ${getButtonClass(btn)}
                                ${btn === '0' ? 'col-span-2' : ''}
                            `}
                        >
                            {btn}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScientificCalculatorPage;