'use client';

import { useState, useEffect } from 'react';
import { KeyRound, Save, Check, Zap, ZapOff, Volume2, VolumeX, Sun, Moon, Monitor, Trash2 } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

type Agent = 'gemini' | 'openai';

const ConfigPage = () => {
  const [apiKeys, setApiKeys] = useState<Record<Agent, string>>({ gemini: '', openai: '' });
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(false);
  const [hapticIntensity, setHapticIntensity] = useState(0.5);

  useEffect(() => {
    const savedApiKeys = localStorage.getItem('userApiKeys');
    if (savedApiKeys) setApiKeys(JSON.parse(savedApiKeys));

    const savedHaptic = localStorage.getItem('hapticFeedback');
    if (savedHaptic) setHapticEnabled(JSON.parse(savedHaptic));

    const savedIntensity = localStorage.getItem('hapticIntensity');
    if (savedIntensity) setHapticIntensity(parseFloat(savedIntensity));

  }, []);

  const handleSaveSettings = () => {
    triggerHapticFeedback();
    localStorage.setItem('userApiKeys', JSON.stringify(apiKeys));
    localStorage.setItem('hapticFeedback', JSON.stringify(hapticEnabled));
    localStorage.setItem('hapticIntensity', hapticIntensity.toString());
    setIsKeySaved(true);
    setTimeout(() => setIsKeySaved(false), 2000);
  };

  const handleResetAll = () => {
    triggerHapticFeedback();
    if (confirm('Are you sure you want to reset all settings? This action cannot be undone.')) {
      localStorage.removeItem('userApiKeys');
      localStorage.removeItem('hapticFeedback');
      localStorage.removeItem('hapticIntensity');
      window.location.reload();
    }
  };

  const handleApiKeyChange = (agent: Agent, value: string) => {
    setApiKeys(prev => ({ ...prev, [agent]: value }));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Configuration</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Manage your API keys and application settings.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b pb-4 dark:border-gray-600">API Keys</h2>
            <div>
              <label htmlFor="geminiApiKey" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">Gemini API Key</label>
              <div className="relative mt-2">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="geminiApiKey" type="password" value={apiKeys.gemini} onChange={(e) => handleApiKeyChange('gemini', e.target.value)} placeholder="Enter your Gemini key" className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>
            <div>
              <label htmlFor="openaiApiKey" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">OpenAI API Key</label>
              <div className="relative mt-2">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="openaiApiKey" type="password" value={apiKeys.openai} onChange={(e) => handleApiKeyChange('openai', e.target.value)} placeholder="Enter your OpenAI key" className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b pb-4 dark:border-gray-600">Haptic Feedback</h2>
            <div className="flex items-center justify-between">
              <label htmlFor="hapticToggle" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Enable Haptic Feedback</label>
              <button id="hapticToggle" onClick={() => setHapticEnabled(!hapticEnabled)} className={`p-2 rounded-full transition-colors ${hapticEnabled ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                {hapticEnabled ? <Zap size={20} /> : <ZapOff size={20} />}
              </button>
            </div>
            {hapticEnabled && (
              <div>
                <label htmlFor="hapticIntensity" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">Intensity</label>
                <div className="flex items-center gap-4 mt-2">
                  <VolumeX size={20} className="text-gray-400" />
                  <input id="hapticIntensity" type="range" min="0.1" max="1" step="0.1" value={hapticIntensity} onChange={(e) => setHapticIntensity(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                  <Volume2 size={20} className="text-gray-400" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <button onClick={handleSaveSettings} className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg text-white font-semibold transition-colors ${isKeySaved ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isKeySaved ? <Check size={20} /> : <Save size={20} />}
              {isKeySaved ? 'Settings Saved!' : 'Save All Settings'}
            </button>
            <button onClick={handleResetAll} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">
              <Trash2 size={20} /> Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;
