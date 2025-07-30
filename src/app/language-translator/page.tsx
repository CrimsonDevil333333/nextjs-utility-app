'use client';

import { useState, useEffect } from 'react';
import { Languages, Clipboard, Check, KeyRound, Save } from 'lucide-react';

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
        localStorage.setItem('userApiKeys', JSON.stringify(apiKeys));
        setIsKeySaved(true);
        setTimeout(() => setIsKeySaved(false), 2000);
    };

    const handleApiKeyChange = (agent: Agent, value: string) => {
        setApiKeys(prev => ({ ...prev, [agent]: value }));
    }

    const handleTranslate = async () => {
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
        navigator.clipboard.writeText(translatedText).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Language Translator 🌐</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Translate text between different languages using AI.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
                <h2 className="text-2xl font-bold mb-4">Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="agent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">AI Agent</label>
                        <select id="agent" value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value as Agent)} className="mt-1 block w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                            <option value="gemini">Gemini</option>
                            <option value="openai">OpenAI (GPT)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{selectedAgent === 'gemini' ? 'Gemini' : 'OpenAI'} API Key</label>
                        <div className="flex gap-2 mt-1">
                            <input id="apiKey" type="password" value={apiKeys[selectedAgent]} onChange={(e) => handleApiKeyChange(selectedAgent, e.target.value)} placeholder={`Enter your ${selectedAgent} key`} className="flex-grow p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            <button onClick={handleSaveApiKeys} className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${isKeySaved ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300'}`}>
                                {isKeySaved ? <Check size={18} /> : <Save size={18} />} {isKeySaved ? 'Saved' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Your Text</h2>
                    <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Enter text to translate..." className="w-full h-64 p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-600" />
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Translation</h2>
                        <select value={targetLang} onChange={e => setTargetLang(e.target.value)} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                            {Object.keys(LANGUAGES).map(lang => <option key={lang} value={lang}>{lang}</option>)}
                        </select>
                    </div>
                    <div className="relative w-full h-64 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50 overflow-y-auto">
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
    );
};

export default LanguageTranslatorPage;
