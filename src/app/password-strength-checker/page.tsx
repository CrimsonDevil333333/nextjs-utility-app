'use client';

import { useState, useMemo } from 'react';

const PasswordStrengthCheckerPage = () => {
    const [password, setPassword] = useState('');

    const strength = useMemo(() => {
        let score = 0;
        const feedback = [];
        if (!password) return { score: 0, feedback: ['Enter a password to check its strength.'], color: 'bg-gray-300', width: '0%', text: '' };

        // Length
        if (password.length >= 8) { score++; }
        if (password.length >= 12) { score++; }
        if (password.length < 8) { feedback.push('Password should be at least 8 characters long.'); }

        // Character types
        if (/[A-Z]/.test(password)) { score++; } else { feedback.push('Add an uppercase letter.'); }
        if (/[a-z]/.test(password)) { score++; } else { feedback.push('Add a lowercase letter.'); }
        if (/[0-9]/.test(password)) { score++; } else { feedback.push('Add a number.'); }
        if (/[^A-Za-z0-9]/.test(password)) { score++; } else { feedback.push('Add a special character (e.g., !@#$).'); }

        const scoreToData = [
            { width: '10%', color: 'bg-red-500', text: 'Very Weak' }, // score 0-1
            { width: '25%', color: 'bg-red-500', text: 'Very Weak' },
            { width: '40%', color: 'bg-orange-500', text: 'Weak' }, // score 2
            { width: '55%', color: 'bg-yellow-500', text: 'Medium' }, // score 3
            { width: '70%', color: 'bg-yellow-500', text: 'Medium' }, // score 4
            { width: '85%', color: 'bg-green-500', text: 'Strong' }, // score 5
            { width: '100%', color: 'bg-green-600', text: 'Very Strong' }, // score 6
        ];
        
        const result = scoreToData[score];
        if (feedback.length === 0) feedback.push('Great password!');

        return { ...result, feedback };
    }, [password]);

    return (
        <div className="max-w-md mx-auto p-4 sm:p-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-800 dark:text-white">Password Strength Checker 🔑</h1>

                <div className="relative">
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        placeholder="Enter your password"
                    />
                </div>

                <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full transition-all duration-300 ${strength.color}`}
                            style={{ width: strength.width || '0%' }}
                        ></div>
                    </div>
                    <p className="text-right text-sm font-bold mt-2" style={{ color: strength.color?.replace('bg-', 'text-') }}>
                        {strength.text}
                    </p>
                </div>
                
                <ul className="mt-4 space-y-2 text-sm">
                    {strength.feedback.map((msg, index) => (
                        <li key={index} className="flex items-start">
                            <span className="mr-2 mt-1">
                                {msg === 'Great password!' ? '✅' : '❌'}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">{msg}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PasswordStrengthCheckerPage;