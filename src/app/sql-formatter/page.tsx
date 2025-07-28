'use client';
import { useState } from 'react';
import { format } from 'sql-formatter';

const SQLFormatterPage = () => {
    const [sql, setSql] = useState('SELECT id, name FROM users WHERE status = \'active\' AND age > 21 ORDER BY name;');
    const [formattedSql, setFormattedSql] = useState('');

    const handleFormat = () => {
        try {
            setFormattedSql(format(sql));
        } catch (error) {
            setFormattedSql('Error: Invalid SQL');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-6">SQL Formatter</h1>
            <div className="space-y-4">
                <textarea value={sql} onChange={(e) => setSql(e.target.value)}
                    placeholder="Enter SQL" rows={8}
                    className="w-full p-2 border rounded-md font-mono dark:bg-gray-700 dark:border-gray-600"></textarea>
                <button onClick={handleFormat} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Format SQL</button>
                {formattedSql && (
                    <pre className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 overflow-x-auto">
                        <code>{formattedSql}</code>
                    </pre>
                )}
            </div>
        </div>
    );
};

export default SQLFormatterPage;