'use client';

import { useState, useMemo, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, X, ArrowRightLeft } from 'lucide-react';

// --- Reusable Components ---

function CopyButton({ valueToCopy, ariaLabel }: { valueToCopy: string; ariaLabel: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (valueToCopy) {
      try {
        await navigator.clipboard.writeText(valueToCopy);
        setCopied(true);
        triggerHapticFeedback();
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  }, [valueToCopy]);

  const isValueEmpty = !valueToCopy || valueToCopy.startsWith('Error:');

  return (
    <button
      onClick={handleCopy}
      disabled={isValueEmpty}
      className={`p-2 rounded-md transition-all duration-200 ease-in-out ${isValueEmpty ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

type Mode = 'encode' | 'decode';
type EncodeType = 'component' | 'full';

export default function UrlEncoderPage() {
  const [input, setInput] = useState('https://example.com/?query=test value');
  const [mode, setMode] = useState<Mode>('encode');
  const [encodeType, setEncodeType] = useState<EncodeType>('component');

  const output = useMemo(() => {
    if (!input) return '';
    try {
      if (mode === 'encode') {
        return encodeType === 'component' ? encodeURIComponent(input) : encodeURI(input);
      }
      return decodeURIComponent(input);
    } catch (e: any) {
      if (e instanceof URIError) {
        return 'Error: Malformed URI sequence for decoding.';
      }
      return 'Error: Invalid input for decoding.';
    }
  }, [input, mode, encodeType]);

  const isOutputError = output.startsWith('Error:');

  const handleSwap = () => {
    triggerHapticFeedback();
    setInput(output);
  };

  const handleClear = () => {
    triggerHapticFeedback();
    setInput('');
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">URL Encoder / Decoder</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Encode or decode your URLs and URI components.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
              <button onClick={() => { setMode('encode'); triggerHapticFeedback(); }} className={`px-5 py-2 rounded-lg text-sm font-medium ${mode === 'encode' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Encode</button>
              <button onClick={() => { setMode('decode'); triggerHapticFeedback(); }} className={`px-5 py-2 rounded-lg text-sm font-medium ${mode === 'decode' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Decode</button>
            </div>
          </div>

          {mode === 'encode' && (
            <div className="flex justify-center mb-6">
              <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
                <button onClick={() => { setEncodeType('component'); triggerHapticFeedback(); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${encodeType === 'component' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Component</button>
                <button onClick={() => { setEncodeType('full'); triggerHapticFeedback(); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${encodeType === 'full' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Full URL</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div>
              <label htmlFor="input-textarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input</label>
              <div className="relative">
                <textarea
                  id="input-textarea"
                  value={input}
                  onFocus={triggerHapticFeedback}
                  onChange={(e) => { setInput(e.target.value); triggerHapticFeedback(); }}
                  placeholder={mode === 'encode' ? 'Enter text or URL...' : 'Enter encoded URL...'}
                  rows={10}
                  className="w-full p-3 font-mono text-sm border rounded-lg resize-y bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {input && <button onClick={handleClear} className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600"><X size={16} /></button>}
              </div>
            </div>
            <div className="flex justify-center my-4 md:my-0">
              <button onClick={handleSwap} className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-transform hover:scale-110 md:rotate-0 rotate-90">
                <ArrowRightLeft size={20} />
              </button>
            </div>
            <div>
              <label htmlFor="output-textarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output</label>
              <div className="relative">
                <textarea
                  id="output-textarea"
                  readOnly
                  value={isOutputError ? output.replace('Error: ', '') : output}
                  placeholder="Result..."
                  rows={10}
                  className={`w-full p-3 font-mono text-sm border rounded-lg resize-y bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 cursor-default ${isOutputError ? 'border-red-500 text-red-500' : ''}`}
                />
                <div className="absolute top-3 right-3">
                  <CopyButton valueToCopy={output} ariaLabel={`Copy ${mode === 'encode' ? 'encoded' : 'decoded'} URL`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
