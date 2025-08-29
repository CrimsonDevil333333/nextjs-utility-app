'use client';

import { useState, useCallback, useEffect } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { v4 as uuidv4, v1 as uuidv1 } from 'uuid';

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

  const isValueEmpty = !valueToCopy;

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

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState<'v4' | 'v1'>('v4');

  const generateUuids = useCallback(() => {
    triggerHapticFeedback();
    const newUuids = Array.from({ length: count }, () => version === 'v4' ? uuidv4() : uuidv1());
    setUuids(newUuids);
  }, [count, version]);

  useEffect(() => {
    generateUuids();
  }, [generateUuids]);

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">UUID Generator</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Generate universally unique identifiers.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="uuid-version" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">UUID Version</label>
              <select id="uuid-version" value={version} onFocus={triggerHapticFeedback} onChange={(e) => { setVersion(e.target.value as 'v4' | 'v1'); triggerHapticFeedback(); }} className="w-full p-3 border rounded-md dark:bg-gray-900 dark:border-gray-600">
                <option value="v4">Version 4 (Random)</option>
                <option value="v1">Version 1 (Timestamp)</option>
              </select>
            </div>
            <div>
              <label htmlFor="uuid-count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Count</label>
              <input id="uuid-count" type="number" value={count} onFocus={triggerHapticFeedback} onChange={(e) => { setCount(parseInt(e.target.value)); triggerHapticFeedback(); }} min="1" max="100" className="w-full p-3 border rounded-md dark:bg-gray-900 dark:border-gray-600" />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {uuids.map((uuid, index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  readOnly
                  value={uuid}
                  className="w-full p-3 font-mono text-base border rounded-lg bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 pr-12"
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-3">
                  <CopyButton valueToCopy={uuid} ariaLabel={`Copy UUID ${index + 1}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={generateUuids} className="px-5 py-3 text-base font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow flex items-center space-x-2">
              <RefreshCw size={18} />
              <span>Generate</span>
            </button>
            <CopyButton valueToCopy={uuids.join('\n')} ariaLabel="Copy all UUIDs" />
          </div>
        </div>
      </div>
    </div>
  );
}
