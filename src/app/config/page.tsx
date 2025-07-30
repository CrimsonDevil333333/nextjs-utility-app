'use client';

import { useState, useEffect } from 'react';
import { KeyRound, Save, Check } from 'lucide-react';

type Agent = 'gemini' | 'openai';

const ConfigPage = () => {
  const [apiKeys, setApiKeys] = useState<Record<Agent, string>>({ gemini: '', openai: '' });
  const [isKeySaved, setIsKeySaved] = useState(false);

  // Load existing keys from localStorage when the component mounts
  useEffect(() => {
    const savedApiKeys = localStorage.getItem('userApiKeys');
    if (savedApiKeys) {
      setApiKeys(JSON.parse(savedApiKeys));
    }
  }, []);

  // Save the updated keys to localStorage
  const handleSaveApiKeys = () => {
    localStorage.setItem('userApiKeys', JSON.stringify(apiKeys));
    setIsKeySaved(true);
    setTimeout(() => setIsKeySaved(false), 2000); // Show confirmation message for 2 seconds
  };

  const handleApiKeyChange = (agent: Agent, value: string) => {
    setApiKeys(prev => ({ ...prev, [agent]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 mt-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Configuration</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Manage your API keys for all AI-powered tools.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
        <div>
          <label htmlFor="geminiApiKey" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">
            Gemini API Key
          </label>
          <div className="relative mt-2">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="geminiApiKey"
              type="password"
              value={apiKeys.gemini}
              onChange={(e) => handleApiKeyChange('gemini', e.target.value)}
              placeholder="Enter your Gemini key"
              className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <label htmlFor="openaiApiKey" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">
            OpenAI API Key
          </label>
          <div className="relative mt-2">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="openaiApiKey"
              type="password"
              value={apiKeys.openai}
              onChange={(e) => handleApiKeyChange('openai', e.target.value)}
              placeholder="Enter your OpenAI key"
              className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <button
          onClick={handleSaveApiKeys}
          className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg text-white font-semibold transition-colors ${
            isKeySaved ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isKeySaved ? <Check size={20} /> : <Save size={20} />}
          {isKeySaved ? 'Keys Saved!' : 'Save All Keys'}
        </button>
      </div>
    </div>
  );
};

export default ConfigPage;
