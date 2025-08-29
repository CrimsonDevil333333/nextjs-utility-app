'use client';

import { useState, useEffect, useCallback } from 'react';
import { Database, Clipboard, Check, KeyRound, Save } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Type Definitions ---
type Agent = 'gemini' | 'openai';
type SqlDialect = 'mysql' | 'postgresql' | 'sqlite' | 'sqlserver';

interface SqlQueryApiResponse {
  sqlQuery: string;
}

interface ErrorResponse {
  error: string;
}

const SqlQueryGeneratorPage = () => {
  const [prompt, setPrompt] = useState('Find all users who signed up last week and live in California');
  const [schema, setSchema] = useState('CREATE TABLE users (id INT, name VARCHAR(255), email VARCHAR(255), signup_date DATE, state VARCHAR(50));');
  const [sqlQuery, setSqlQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [sqlDialect, setSqlDialect] = useState<SqlDialect>('postgresql');

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

  const handleGenerate = async () => {
    triggerHapticFeedback();
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
          schema,
          dialect: sqlDialect,
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
    triggerHapticFeedback();
    navigator.clipboard.writeText(sqlQuery).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const setExamplePrompt = (example: string) => {
    triggerHapticFeedback();
    setPrompt(example);
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">AI SQL Query Generator 🗃️</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Describe what you need in plain English to generate a SQL query.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
            <h2 className="text-2xl font-bold mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Agent</label>
                <div className="flex gap-2 bg-slate-200 dark:bg-slate-700/50 p-1 rounded-full">
                  <button onClick={() => { setSelectedAgent('gemini'); triggerHapticFeedback(); }} className={`w-full py-2 rounded-full font-semibold transition-all duration-200 ${selectedAgent === 'gemini' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>Gemini</button>
                  <button onClick={() => { setSelectedAgent('openai'); triggerHapticFeedback(); }} className={`w-full py-2 rounded-full font-semibold transition-all duration-200 ${selectedAgent === 'openai' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>OpenAI</button>
                </div>
              </div>
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{selectedAgent === 'gemini' ? 'Gemini' : 'OpenAI'} API Key</label>
                <div className="flex gap-2 mt-2">
                  <div className="relative flex-grow">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                    <input id="apiKey" type="password" value={apiKeys[selectedAgent]} onFocus={triggerHapticFeedback} onChange={(e) => handleApiKeyChange(selectedAgent, e.target.value)} placeholder={`Enter your ${selectedAgent} key`} className="w-full p-3 pl-10 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                  <button onClick={handleSaveApiKeys} className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm ${isKeySaved ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`} aria-label="Save API Key">
                    {isKeySaved ? <Check size={18} /> : <Save size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="sql-dialect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SQL Dialect</label>
              <select id="sql-dialect" value={sqlDialect} onFocus={triggerHapticFeedback} onChange={(e) => { setSqlDialect(e.target.value as SqlDialect); triggerHapticFeedback(); }} className="w-full p-3 border rounded-md dark:bg-gray-900 dark:border-gray-600">
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="sqlite">SQLite</option>
                <option value="sqlserver">MS SQL Server</option>
              </select>
            </div>
            <div>
              <label htmlFor="schema" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Table Schema (Optional, but recommended)</label>
              <textarea id="schema" value={schema} onFocus={triggerHapticFeedback} onChange={(e) => { setSchema(e.target.value); triggerHapticFeedback(); }} placeholder="e.g., CREATE TABLE users (id INT, name VARCHAR(255));" rows={4} className="w-full p-3 border rounded-md font-mono dark:bg-gray-900 dark:border-gray-600 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="prompt" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Describe Your Query</label>
              <textarea id="prompt" value={prompt} onFocus={triggerHapticFeedback} onChange={(e) => { setPrompt(e.target.value); triggerHapticFeedback(); }} placeholder="e.g., Get the top 5 products with the highest sales this month" className="w-full h-24 p-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              <div className="flex flex-wrap gap-2 mt-2">
                <button onClick={() => setExamplePrompt('Count of users by country')} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md">Users by country</button>
                <button onClick={() => setExamplePrompt('Total sales per month')} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md">Sales per month</button>
                <button onClick={() => setExamplePrompt('Find duplicate emails in users table')} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md">Find duplicate emails</button>
              </div>
            </div>
            <button onClick={handleGenerate} disabled={isLoading || !apiKeys[selectedAgent]} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400/50 transition-colors">
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
      </div>
    </div>
  );
};

export default SqlQueryGeneratorPage;
