'use client';
import { useState } from 'react';

const TextSorterPage = () => {
    const [text, setText] = useState('Zebra\nApple\nCat\nBanana');

    const sort = (type: 'asc' | 'desc' | 'len_asc' | 'len_desc') => {
        const lines = text.split('\n');
        switch (type) {
            case 'asc': lines.sort(); break;
            case 'desc': lines.sort().reverse(); break;
            case 'len_asc': lines.sort((a, b) => a.length - b.length); break;
            case 'len_desc': lines.sort((a, b) => b.length - a.length); break;
        }
        setText(lines.join('\n'));
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-6">Text Sorter</h1>
            <textarea value={text} onChange={(e) => setText(e.target.value)}
                rows={10}
                className="w-full p-2 border rounded-md font-mono dark:bg-gray-700 dark:border-gray-600"></textarea>
            <div className="flex gap-2 mt-4">
                <button onClick={() => sort('asc')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">A-Z</button>
                <button onClick={() => sort('desc')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Z-A</button>
                <button onClick={() => sort('len_asc')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">By Length (Asc)</button>
                <button onClick={() => sort('len_desc')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">By Length (Desc)</button>
            </div>
        </div>
    );
};

export default TextSorterPage;