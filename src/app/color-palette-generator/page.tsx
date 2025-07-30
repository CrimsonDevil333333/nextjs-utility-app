'use client';

import { useState, useEffect } from 'react';
import { Palette, Clipboard, Check, KeyRound, Save } from 'lucide-react';

// --- Type Definitions ---
type Agent = 'gemini' | 'openai';

/**
 * Defines the structure for a successful API response.
 */
interface PaletteApiResponse {
  colors: string[];
}

/**
 * Defines the structure for an error API response.
 */
interface ErrorResponse {
  error: string;
}

const ColorPaletteGeneratorPage = () => {
  const [prompt, setPrompt] = useState('serene beach sunset');
  const [palette, setPalette] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

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
      setError('Please enter a prompt.');
      return;
    }
    if (!currentApiKey.trim()) {
      setError(`Please enter and save your ${selectedAgent} API key.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setPalette([]);

    try {
      const response = await fetch('/api/palette', {
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

      const data = await response.json() as PaletteApiResponse;
      setPalette(data.colors);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">AI Color Palette Generator 🎨</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Describe a theme or mood to generate a color palette.</p>
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
        {/* Add other agents here using the same pattern */}
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

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., cyberpunk city at night"
                className="flex-grow p-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
                onClick={handleGenerate}
                disabled={isLoading || !apiKeys[selectedAgent]}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400/50 transition-colors"
            >
                {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Palette size={20} /> Generate</>}
            </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            {palette.map((color, index) => (
                <div key={index} className="text-center">
                    <div 
                        className="w-full aspect-square rounded-lg shadow-md"
                        style={{ backgroundColor: color }}
                    />
                    <button 
                        onClick={() => handleCopy(color)}
                        className="mt-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-mono hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        {copiedColor === color ? <Check className="inline-block w-4 h-4 text-green-500" /> : color}
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteGeneratorPage;
