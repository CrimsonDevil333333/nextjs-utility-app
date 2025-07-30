'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Clipboard, Check, KeyRound, Save } from 'lucide-react';

// --- Types and Constants ---
type Agent = 'gemini' | 'openai';

const TextSummarizerPage = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // --- State for API Keys and Agent Selection ---
  const [apiKeys, setApiKeys] = useState<Record<Agent, string>>({ gemini: '', openai: '' });
  const [selectedAgent, setSelectedAgent] = useState<Agent>('gemini');
  const [isKeySaved, setIsKeySaved] = useState(false);

  // --- Load API Keys from localStorage on initial render ---
  useEffect(() => {
    const savedApiKeys = localStorage.getItem('userApiKeys');
    if (savedApiKeys) {
      setApiKeys(JSON.parse(savedApiKeys));
    }
  }, []);

  const handleSaveApiKeys = () => {
    localStorage.setItem('userApiKeys', JSON.stringify(apiKeys));
    setIsKeySaved(true);
    setTimeout(() => setIsKeySaved(false), 2000); // Show confirmation for 2 seconds
  };
  
  const handleApiKeyChange = (agent: Agent, value: string) => {
      setApiKeys(prev => ({...prev, [agent]: value}));
  }

  const handleSummarize = async () => {
    const currentApiKey = apiKeys[selectedAgent];
    if (!inputText.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }
    if (!currentApiKey.trim()) {
      setError(`Please enter and save your ${selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1)} API key.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: inputText,
          apiKey: currentApiKey,
          agent: selectedAgent
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = (typeof errorData === 'object' && errorData !== null && 'error' in errorData)
          ? (errorData as { error?: string }).error
          : undefined;
        throw new Error(errorMsg || 'An unknown error occurred.');
      }

      const data = await response.json() as { summary: string };
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">AI Text Summarizer ✨</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Get a concise summary of any long text using AI.</p>
      </div>

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
          onClick={() => setSelectedAgent('gemini')}
          className={`w-full py-2 rounded-full font-semibold transition-all duration-200 ${
            selectedAgent === 'gemini'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          Gemini
        </button>
        <button
          onClick={() => setSelectedAgent('openai')}
          className={`w-full py-2 rounded-full font-semibold transition-all duration-200 ${
            selectedAgent === 'openai'
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
            onChange={(e) => handleApiKeyChange(selectedAgent, e.target.value)}
            placeholder={`Enter your ${selectedAgent} key`}
            className="w-full p-3 pl-10 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button
          onClick={handleSaveApiKeys}
          className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm ${
            isKeySaved
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
        {/* Input Area */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Text</h2>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your article, essay, or any long text here..."
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSummarize}
            disabled={isLoading || !apiKeys[selectedAgent]}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400/50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Sparkles size={20} /> Summarize
              </>
            )}
          </button>
        </div>

        {/* Output Area */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Summary</h2>
          <div className="relative w-full h-64 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 overflow-y-auto">
            {isLoading && (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Generating summary...</p>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            {summary && (
              <>
                <p className="whitespace-pre-wrap">{summary}</p>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Clipboard className="w-5 h-5" />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSummarizerPage;
