'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Clipboard, Check, KeyRound, Save } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Type Definitions ---
type Agent = 'gemini' | 'openai';
type SummaryLength = 'short' | 'medium' | 'long';
type SummaryFormat = 'paragraph' | 'bullets';

interface SummarizeApiResponse {
  summary: string;
}

interface ErrorResponse {
  error: string;
}

const TextSummarizerPage = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // New feature states
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium');
  const [summaryFormat, setSummaryFormat] = useState<SummaryFormat>('paragraph');

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

  const handleSummarize = async () => {
    triggerHapticFeedback();
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
          length: summaryLength,
          format: summaryFormat,
          apiKey: currentApiKey,
          agent: selectedAgent
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse;
        throw new Error(errorData.error || 'An unknown error occurred.');
      }

      const data = await response.json() as SummarizeApiResponse;
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    triggerHapticFeedback();
    navigator.clipboard.writeText(summary).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const loadExample = () => {
    triggerHapticFeedback();
    setInputText("The history of the computer is a fascinating journey of innovation. Early calculating devices like the abacus laid the groundwork for mechanical calculators in the 17th century. The 19th century saw Charles Babbage's conceptual designs for analytical engines, which were essentially the first general-purpose computers. The 20th century brought the electronic revolution, with the creation of massive vacuum tube computers like ENIAC. The invention of the transistor and later the integrated circuit made computers smaller, faster, and more accessible, leading to the personal computer revolution in the 1970s and 80s. Today, computers are ubiquitous, integrated into everything from smartphones to cars, powered by microprocessors containing billions of transistors.");
  };

  const stats = {
    words: inputText.trim().split(/\s+/).filter(Boolean).length,
    chars: inputText.length,
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">AI Text Summarizer ✨</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Get a concise summary of any long text using AI.</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Your Text</h2>
              <div className="relative">
                <textarea
                  value={inputText}
                  onFocus={triggerHapticFeedback}
                  onChange={(e) => { setInputText(e.target.value); triggerHapticFeedback(); }}
                  placeholder="Paste your article, essay, or any long text here..."
                  className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
                />
                <button onClick={loadExample} className="absolute bottom-3 left-3 px-2 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md">Load Example</button>
              </div>
              <div className="flex justify-end gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Characters: {stats.chars}</span>
                <span>Words: {stats.words}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Summary</h2>
              <div className="relative w-full h-64 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">Generating summary...</p>
                  </div>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : summary ? (
                  <>
                    <p className="whitespace-pre-wrap">{summary}</p>
                    <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
                      {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Clipboard className="w-5 h-5" />}
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500">Your summary will appear here.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Summary Length</label>
                <div className="flex gap-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
                  <button onClick={() => { setSummaryLength('short'); triggerHapticFeedback(); }} className={`w-full py-2 rounded-full font-semibold ${summaryLength === 'short' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Short</button>
                  <button onClick={() => { setSummaryLength('medium'); triggerHapticFeedback(); }} className={`w-full py-2 rounded-full font-semibold ${summaryLength === 'medium' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Medium</button>
                  <button onClick={() => { setSummaryLength('long'); triggerHapticFeedback(); }} className={`w-full py-2 rounded-full font-semibold ${summaryLength === 'long' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Long</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Format</label>
                <div className="flex gap-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
                  <button onClick={() => { setSummaryFormat('paragraph'); triggerHapticFeedback(); }} className={`w-full py-2 rounded-full font-semibold ${summaryFormat === 'paragraph' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Paragraph</button>
                  <button onClick={() => { setSummaryFormat('bullets'); triggerHapticFeedback(); }} className={`w-full py-2 rounded-full font-semibold ${summaryFormat === 'bullets' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Bullets</button>
                </div>
              </div>
            </div>
            <button onClick={handleSummarize} disabled={isLoading || !apiKeys[selectedAgent]} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400/50 transition-colors">
              {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Sparkles size={20} /> Summarize</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSummarizerPage;
