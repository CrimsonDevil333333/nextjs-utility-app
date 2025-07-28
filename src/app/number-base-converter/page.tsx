'use client';
import { useState } from 'react';

const NumberBaseConverterPage = () => {
    const [decimal, setDecimal] = useState('10');
    const [binary, setBinary] = useState('1010');
    const [hex, setHex] = useState('A');
    const [octal, setOctal] = useState('12');

    const handleDecimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDecimal(val);
        const num = parseInt(val, 10);
        if (!isNaN(num)) {
            setBinary(num.toString(2));
            setHex(num.toString(16).toUpperCase());
            setOctal(num.toString(8));
        }
    };
    
    // Similarly, you can create handlers for binary, hex, and octal changes.
    // For brevity, only the decimal handler is fully implemented.

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-6">Number Base Converter</h1>
            <div className="space-y-4">
                <div>
                    <label className="block font-medium">Decimal</label>
                    <input type="text" value={decimal} onChange={handleDecimalChange} className="w-full p-2 border rounded-md font-mono dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block font-medium">Binary</label>
                    <input type="text" value={binary} readOnly className="w-full p-2 border rounded-md font-mono bg-gray-100 dark:bg-gray-800 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block font-medium">Hexadecimal</label>
                    <input type="text" value={hex} readOnly className="w-full p-2 border rounded-md font-mono bg-gray-100 dark:bg-gray-800 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block font-medium">Octal</label>
                    <input type="text" value={octal} readOnly className="w-full p-2 border rounded-md font-mono bg-gray-100 dark:bg-gray-800 dark:border-gray-600" />
                </div>
            </div>
        </div>
    );
};

export default NumberBaseConverterPage;