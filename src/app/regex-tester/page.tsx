'use client';
import { useState, useMemo } from 'react';

const RegexTesterPage = () => {
    const [pattern, setPattern] = useState('\\b[A-Z]+\\b');
    const [flags, setFlags] = useState('g');
    const [testString, setTestString] = useState('This is a Test String with a few TEST words.');
    
    const highlightedResult = useMemo(() => {
        try {
            const regex = new RegExp(pattern, flags);
            return testString.replace(regex, (match) => `<mark>${match}</mark>`);
        } catch (error) {
            return `<span class="text-red-500">Invalid Regular Expression</span>`;
        }
    }, [pattern, flags, testString]);

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-6">Regex Tester</h1>
            <div className="space-y-4">
                <div className="flex gap-4">
                    <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)}
                        placeholder="Regular Expression" className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)}
                        placeholder="Flags (e.g., gi)" className="w-24 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <textarea value={testString} onChange={(e) => setTestString(e.target.value)}
                    placeholder="Test String" rows={8}
                    className="w-full p-2 border rounded-md font-mono dark:bg-gray-700 dark:border-gray-600"></textarea>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Result</h2>
                    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800"
                         dangerouslySetInnerHTML={{ __html: highlightedResult }} />
                </div>
            </div>
        </div>
    );
};

export default RegexTesterPage;