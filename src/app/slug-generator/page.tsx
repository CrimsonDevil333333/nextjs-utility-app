'use client';
import { useState } from 'react';

const SlugGeneratorPage = () => {
    const [text, setText] = useState('Hello World! This is a Title.');
    
    const slug = text
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-'); // Replace multiple - with single -

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-6">Slug Generator</h1>
            <div className="space-y-4">
                <textarea value={text} onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text" rows={4}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Generated Slug</h2>
                    <input type="text" value={slug} readOnly className="w-full p-2 border rounded-md font-mono bg-gray-100 dark:bg-gray-800 dark:border-gray-600" />
                </div>
            </div>
        </div>
    );
};

export default SlugGeneratorPage;