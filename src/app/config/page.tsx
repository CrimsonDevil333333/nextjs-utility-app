'use client';

import { useState, useEffect } from 'react';
import { KeyRound, Save, Check, Zap, ZapOff, Volume2, VolumeX, Trash2, RefreshCw, Clock, Smartphone, Square } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { motion, AnimatePresence } from 'framer-motion';

type Agent = 'gemini' | 'openai';
type MobileFilterStyle = 'sheet' | 'modal';

// --- Reusable Components ---

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (enabled: boolean) => void }) => {
  const handleToggle = () => {
    triggerHapticFeedback();
    onChange(!enabled);
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
};

const PillSelector = ({ options, selectedValue, onSelect }: { options: { value: string; label: string; icon: React.ReactNode }[], selectedValue: string, onSelect: (value: any) => void }) => (
  <div className="flex w-full rounded-lg bg-gray-200 dark:bg-gray-900 p-1">
    {options.map(({ value, label, icon }) => (
      <button
        key={value}
        onClick={() => { onSelect(value); triggerHapticFeedback(); }}
        className={`flex-1 rounded-md py-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${selectedValue === value ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'}`}
      >
        {icon}
        {label}
      </button>
    ))}
  </div>
);


// --- Main Page Component ---

const ConfigPage = () => {
  const [apiKeys, setApiKeys] = useState<Record<Agent, string>>({ gemini: '', openai: '' });
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(false);
  const [hapticIntensity, setHapticIntensity] = useState(0.5);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [clearRecentMessage, setClearRecentMessage] = useState('');

  // New state for enhanced features
  const [autoClearInput, setAutoClearInput] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [showToolCounts, setShowToolCounts] = useState(false);
  const [mobileFilterStyle, setMobileFilterStyle] = useState<MobileFilterStyle>('sheet');

  useEffect(() => {
    // Load settings from localStorage on initial render
    const savedApiKeys = localStorage.getItem('userApiKeys');
    if (savedApiKeys) setApiKeys(JSON.parse(savedApiKeys));

    const savedHaptic = localStorage.getItem('hapticFeedback');
    if (savedHaptic) setHapticEnabled(JSON.parse(savedHaptic));

    const savedIntensity = localStorage.getItem('hapticIntensity');
    if (savedIntensity) setHapticIntensity(parseFloat(savedIntensity));

    const savedAutoClear = localStorage.getItem('autoClearInput');
    if (savedAutoClear) setAutoClearInput(JSON.parse(savedAutoClear));

    const savedAnimations = localStorage.getItem('animationsEnabled');
    if (savedAnimations) setAnimationsEnabled(JSON.parse(savedAnimations));

    const savedShowCounts = localStorage.getItem('showToolCounts');
    if (savedShowCounts) setShowToolCounts(JSON.parse(savedShowCounts));

    const savedFilterStyle = localStorage.getItem('mobileFilterStyle') as MobileFilterStyle;
    if (savedFilterStyle) setMobileFilterStyle(savedFilterStyle);

  }, []);

  const handleSaveSettings = () => {
    triggerHapticFeedback();
    localStorage.setItem('userApiKeys', JSON.stringify(apiKeys));
    localStorage.setItem('hapticFeedback', JSON.stringify(hapticEnabled));
    localStorage.setItem('hapticIntensity', hapticIntensity.toString());
    localStorage.setItem('autoClearInput', JSON.stringify(autoClearInput));
    localStorage.setItem('animationsEnabled', JSON.stringify(animationsEnabled));
    localStorage.setItem('showToolCounts', JSON.stringify(showToolCounts));
    localStorage.setItem('mobileFilterStyle', mobileFilterStyle);
    setIsKeySaved(true);
    setTimeout(() => setIsKeySaved(false), 2000);
  };

  const handleResetAll = () => {
    triggerHapticFeedback();
    localStorage.clear(); // Clears all items in localStorage
    window.location.reload();
  };

  const handleClearRecent = () => {
    triggerHapticFeedback();
    localStorage.removeItem('recentlyUsedTools');
    setClearRecentMessage('Cleared!');
    setTimeout(() => {
      setClearRecentMessage('');
    }, 2000);
  }

  const handleApiKeyChange = (agent: Agent, value: string) => {
    setApiKeys(prev => ({ ...prev, [agent]: value }));
  };

  const mobileFilterOptions = [
    { value: 'sheet', label: 'Bottom Sheet', icon: <Smartphone size={16} /> },
    { value: 'modal', label: 'Center Modal', icon: <Square size={16} /> },
  ];

  const commonInputClass = "w-full p-3 pl-10 border rounded-lg bg-gray-50 dark:bg-gray-900/50 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";
  const cardClass = "bg-white/80 dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-200/80 dark:border-gray-700/50";

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Configuration</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Manage your API keys and application settings.</p>
          </div>

          <div className="space-y-6">
            <div className={cardClass}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">API Keys</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gemini API Key</label>
                  <div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input id="geminiApiKey" type="password" value={apiKeys.gemini} onChange={(e) => handleApiKeyChange('gemini', e.target.value)} placeholder="Enter your Gemini key" className={commonInputClass} /></div>
                </div>
                <div>
                  <label htmlFor="openaiApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">OpenAI API Key</label>
                  <div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input id="openaiApiKey" type="password" value={apiKeys.openai} onChange={(e) => handleApiKeyChange('openai', e.target.value)} placeholder="Enter your OpenAI key" className={commonInputClass} /></div>
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label htmlFor="hapticToggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Haptic Feedback</label>
                  <ToggleSwitch enabled={hapticEnabled} onChange={setHapticEnabled} />
                </div>
                {hapticEnabled && (
                  <div>
                    <label htmlFor="hapticIntensity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Intensity</label>
                    <div className="flex items-center gap-4 mt-2"><VolumeX size={20} className="text-gray-400" /><input id="hapticIntensity" type="range" min="0.1" max="1" step="0.1" value={hapticIntensity} onChange={(e) => setHapticIntensity(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:bg-blue-600 [&::-moz-range-thumb]:bg-blue-600" /><Volume2 size={20} className="text-gray-400" /></div>
                  </div>
                )}
              </div>
            </div>

            <div className={cardClass}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">UI & Behavior</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label htmlFor="animationsToggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable animations</label>
                  <ToggleSwitch enabled={animationsEnabled} onChange={setAnimationsEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="showCountsToggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">Show tool counts</label>
                  <ToggleSwitch enabled={showToolCounts} onChange={setShowToolCounts} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Filter Style</label>
                  <PillSelector options={mobileFilterOptions} selectedValue={mobileFilterStyle} onSelect={setMobileFilterStyle} />
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Data & Cache</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label htmlFor="autoClearToggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-clear input on tool switch</label>
                  <ToggleSwitch enabled={autoClearInput} onChange={setAutoClearInput} />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="clearRecent" className="text-sm font-medium text-gray-700 dark:text-gray-300">Clear recently used tools</label>
                  <div className="relative flex items-center gap-2">
                    <AnimatePresence>
                      {clearRecentMessage && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="text-sm font-medium text-green-600 dark:text-green-400"
                        >
                          {clearRecentMessage}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button onClick={handleClearRecent} className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <Clock size={16} /> Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={handleSaveSettings} className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${isKeySaved ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/50'}`}>
                {isKeySaved ? <Check size={20} /> : <Save size={20} />}
                {isKeySaved ? 'Settings Saved!' : 'Save All Settings'}
              </button>
              <button onClick={() => { setShowResetConfirm(true); triggerHapticFeedback(); }} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-red-100 hover:text-red-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors">
                <Trash2 size={20} /> Reset All
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showResetConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Reset All Settings?</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure? This will clear all your saved API keys and preferences. This action cannot be undone.</p>
              <div className="flex justify-end items-center gap-3">
                <button onClick={() => setShowResetConfirm(false)} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                <button onClick={handleResetAll} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md">Yes, Reset</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ConfigPage;
