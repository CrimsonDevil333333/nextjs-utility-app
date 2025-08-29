'use client';

import { useState, useEffect, useCallback } from 'react';
import { Languages, Clipboard, Check, KeyRound, Save } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Types and Constants ---
type Agent = 'gemini' | 'openai';
const LANGUAGES = {
    'English': 'en', 'Spanish': 'es', 'French': 'fr', 'German': 'de', 'Italian': 'it', 'Japanese': 'ja', 'Korean': 'ko', 'Mandarin': 'zh', 'Hindi': 'hi'
};

type TranslationResponse = {
    translation: string;
};

const LanguageTranslatorPage = () => {
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [targetLang, setTargetLang] = useState('Spanish');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const [apiKeys, setApiKeys] = useState<Record<Agent, string>>({ gemini: '', openai: '' });
    const [selectedAgent, setSelectedAgent] = useState<Agent>('gemini');
    const [isKeySaved, setIsKeySaved] = useState(false);

    useEffect(() => {
        const savedApiKeys = localStorage.getItem('userApiKeys');
        if (savedApiKeys) {
            setApiKeys(JSON.parse(savedApiKeys));
        }
    }, []);

    const handleSaveApiKeys = () => {
        triggerHapticFeedback();
        localStorage.setItem('userApiKeys', JSON.stringify(apiKeys));
        setIsKeySaved(true);
        setTimeout(() => setIsKeySaved(false), 2000);
    };

    const handleApiKeyChange = (agent: Agent, value: string) => {
        setApiKeys(prev => ({ ...prev, [agent]: value }));
    }

    const handleTranslate = async () => {
        triggerHapticFeedback();
        const currentApiKey = apiKeys[selectedAgent];
        if (!inputText.trim()) {
            setError('Please enter some text to translate.');
            return;
        }
        if (!currentApiKey.trim()) {
            setError(`Please enter and save your ${selectedAgent} API key.`);
            return;
        }

        setIsLoading(true);
        setError(null);
        setTranslatedText('');

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: inputText,
                    targetLang,
                    apiKey: currentApiKey,
                    agent: selectedAgent
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMsg = (errorData as { error?: string })?.error || 'An unknown error occurred.';
                throw new Error(errorMsg);
            }

            const data = await response.json() as TranslationResponse;
            setTranslatedText(data.translation);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        triggerHapticFeedback();
        navigator.clipboard.writeText(translatedText).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Language Translator 🌐</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Translate text between different languages using AI.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
                        <h2 className="text-2xl font-bold mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                            Configuration
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    AI Agent
                                </label>
                                <div className="flex gap-2 bg-slate-200 dark:bg-slate-700/50 p-1 rounded-full">
                                    <button
                                        onClick={() => { setSelectedAgent('gemini'); triggerHapticFeedback(); }}
                                        className={`w-full py-2 rounded-full font-semibold transition-all duration-200 ${selectedAgent === 'gemini'
                                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                                            }`}
                                    >
                                        Gemini
                                    </button>
                                    <button
                                        onClick={() => { setSelectedAgent('openai'); triggerHapticFeedback(); }}
                                        className={`w-full py-2 rounded-full font-semibold transition-all duration-200 ${selectedAgent === 'openai'
                                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                                            }`}
                                    >
                                        OpenAI
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="apiKey"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    {selectedAgent === 'gemini' ? 'Gemini' : 'OpenAI'} API Key
                                </label>
                                <div className="flex gap-2 mt-2">
                                    <div className="relative flex-grow">
                                        <KeyRound
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                        <input
                                            id="apiKey"
                                            type="password"
                                            value={apiKeys[selectedAgent]}
                                            onFocus={triggerHapticFeedback}
                                            onChange={(e) => handleApiKeyChange(selectedAgent, e.target.value)}
                                            placeholder={`Enter your ${selectedAgent} key`}
                                            className="w-full p-3 pl-10 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSaveApiKeys}
                                        className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm ${isKeySaved
                                            ? 'bg-green-500 text-white'
                                            : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                                            }`}
                                        aria-label="Save API Key"
                                    >
                                        {isKeySaved ? <Check size={18} /> : <Save size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">Your Text</h2>
                            <textarea value={inputText} onFocus={triggerHapticFeedback} onChange={(e) => { setInputText(e.target.value); triggerHapticFeedback(); }} placeholder="Enter text to translate..." className="w-full h-64 p-4 border rounded-lg dark:bg-gray-900 dark:border-gray-600" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Translation</h2>
                                <select value={targetLang} onFocus={triggerHapticFeedback} onChange={e => { setTargetLang(e.target.value); triggerHapticFeedback(); }} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                                    {Object.keys(LANGUAGES).map(lang => <option key={lang} value={lang}>{lang}</option>)}
                                </select>
                            </div>
                            <div className="relative w-full h-64 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
                                {isLoading && <p className="text-gray-500">Translating...</p>}
                                {error && <p className="text-red-500">{error}</p>}
                                {translatedText && (
                                    <>
                                        <p className="whitespace-pre-wrap">{translatedText}</p>
                                        <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300">
                                            {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Clipboard className="w-5 h-5" />}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button onClick={handleTranslate} disabled={isLoading || !apiKeys[selectedAgent]} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400/50 transition-colors">
                            {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Languages size={20} /> Translate</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LanguageTranslatorPage;
