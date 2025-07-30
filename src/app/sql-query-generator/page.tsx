'use client';

import { useState, useEffect } from 'react';
import { Database, Clipboard, Check, KeyRound, Save } from 'lucide-react';

// --- Type Definitions ---
type Agent = 'gemini' | 'openai';

/**
 * Defines the structure for a successful API response.
 */
interface SqlQueryApiResponse {
  sqlQuery: string;
}

/**
 * Defines the structure for an error API response.
 */
interface ErrorResponse {
  error: string;
}

const SqlQueryGeneratorPage = () => {
  const [prompt, setPrompt] = useState('Find all users who signed up last week and live in California');
  const [sqlQuery, setSqlQuery] = useState('');
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
      setApiKeys(prev => ({...prev, [agent]: value}));
  }

  const handleGenerate = async () => {
    const currentApiKey = apiKeys[selectedAgent];
    if (!prompt.trim()) {
      setError('Please enter a description of the query you want.');
      return;
    }
    if (!currentApiKey.trim()) {
      setError(`Please enter and save your ${selectedAgent} API key.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSqlQuery('');

    try {
      const response = await fetch('/api/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          apiKey: currentApiKey,
          agent: selectedAgent
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse;
        throw new Error(errorData.error || 'An unknown error occurred.');
      }

      const data = await response.json() as SqlQueryApiResponse;
      setSqlQuery(data.sqlQuery);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlQuery).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">AI SQL Query Generator 🗃️</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Describe what you need in plain English to generate a SQL query.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-2xl font-bold mb-4">Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="agent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">AI Agent</label>
            <select id="agent" value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value as Agent)} className="mt-1 block w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600">
              <option value="gemini">Gemini</option>
            </select>
          </div>
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{selectedAgent === 'gemini' ? 'Gemini' : 'OpenAI'} API Key</label>
            <div className="flex gap-2 mt-1">
              <input id="apiKey" type="password" value={apiKeys[selectedAgent]} onChange={(e) => handleApiKeyChange(selectedAgent, e.target.value)} placeholder={`Enter your ${selectedAgent} key`} className="flex-grow p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
              <button onClick={handleSaveApiKeys} className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${isKeySaved ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300'}`}>
                {isKeySaved ? <Check size={18} /> : <Save size={18} />} {isKeySaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
            <label htmlFor="prompt" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Describe Your Query</label>
            <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Get the top 5 products with the highest sales this month"
                className="w-full h-24 p-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
        </div>
        <button
            onClick={handleGenerate}
            disabled={isLoading || !apiKeys[selectedAgent]}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400/50 transition-colors"
        >
            {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Database size={20} /> Generate SQL</>}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-2">Generated SQL</h2>
            <div className="relative w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-900 text-white font-mono min-h-[150px] overflow-x-auto">
                {isLoading ? <p className="text-gray-400">Generating...</p> : <pre><code>{sqlQuery || '// Your generated SQL will appear here'}</code></pre>}
                {sqlQuery && (
                    <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-gray-700 rounded-md hover:bg-gray-600">
                        {isCopied ? <Check className="w-5 h-5 text-green-400" /> : <Clipboard className="w-5 h-5" />}
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SqlQueryGeneratorPage;
