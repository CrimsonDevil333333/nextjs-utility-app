'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, X, ArrowRightLeft, Upload, Download } from 'lucide-react';

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

type Mode = 'csvToJson' | 'jsonToCsv';

export default function CsvJsonConverterPage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('csvToJson');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertCsvToJson = (csv: string): string => {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return '[]';
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const obj: { [key: string]: any } = {};
      const currentLine = lines[i].split(',');
      if (currentLine.length !== headers.length) {
        throw new Error(`Row ${i + 1} has mismatched columns.`);
      }
      for (let j = 0; j < headers.length; j++) {
        const key = headers[j];
        const rawValue = currentLine[j].trim();
        if (rawValue === 'true') obj[key] = true;
        else if (rawValue === 'false') obj[key] = false;
        else if (rawValue === 'null' || rawValue === '') obj[key] = null;
        else if (!isNaN(Number(rawValue))) obj[key] = Number(rawValue);
        else obj[key] = rawValue;
      }
      result.push(obj);
    }
    return JSON.stringify(result, null, 2);
  };

  const convertJsonToCsv = (json: string): string => {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('JSON must be an array of objects.');
    }
    const headers = Array.from(new Set(parsed.flatMap(Object.keys)));
    const csvLines = [headers.join(',')];
    parsed.forEach(item => {
      const values = headers.map(header => {
        const value = item[header];
        if (value === null || typeof value === 'undefined') return '';
        const stringValue = String(value);
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      });
      csvLines.push(values.join(','));
    });
    return csvLines.join('\n');
  };

  const output = useMemo(() => {
    setError(null);
    if (!input.trim()) return '';
    try {
      return mode === 'csvToJson' ? convertCsvToJson(input) : convertJsonToCsv(input);
    } catch (e: any) {
      setError(e.message);
      return '';
    }
  }, [input, mode]);

  const handleClear = useCallback(() => {
    triggerHapticFeedback();
    setInput('');
    setError(null);
  }, []);

  const handleSwap = () => {
    triggerHapticFeedback();
    setInput(output);
    setMode(prev => prev === 'csvToJson' ? 'jsonToCsv' : 'csvToJson');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      triggerHapticFeedback();
      const reader = new FileReader();
      reader.onload = (event) => {
        setInput(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    triggerHapticFeedback();
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${mode === 'csvToJson' ? 'json' : 'csv'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (mode === 'csvToJson') {
      setInput('name,age,city\nJohn Doe,30,"New York"\nJane Smith,25,London');
    } else {
      setInput('[{"name":"John Doe","age":30,"city":"New York"},{"name":"Jane Smith","age":25,"city":"London"}]');
    }
  }, [mode]);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">CSV & JSON Converter</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Convert between CSV and JSON formats with ease.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
              <button onClick={() => { setMode('csvToJson'); triggerHapticFeedback(); }} className={`px-5 py-2 rounded-lg text-sm font-medium ${mode === 'csvToJson' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>CSV to JSON</button>
              <button onClick={() => { setMode('jsonToCsv'); triggerHapticFeedback(); }} className={`px-5 py-2 rounded-lg text-sm font-medium ${mode === 'jsonToCsv' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>JSON to CSV</button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 text-red-800 bg-red-100 border border-red-300 rounded-lg dark:text-red-300 dark:bg-red-900/50 dark:border-red-600">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div>
              <label htmlFor="input-data" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{mode === 'csvToJson' ? 'CSV Input' : 'JSON Input'}</label>
              <div className="relative">
                <textarea id="input-data" value={input} onFocus={triggerHapticFeedback} onChange={(e) => { setInput(e.target.value); triggerHapticFeedback(); }} rows={10} className="w-full p-3 font-mono text-sm border rounded-lg resize-y bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {input && <button onClick={handleClear} className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600"><X size={16} /></button>}
              </div>
            </div>
            <div className="flex justify-center my-4 md:my-0">
              <button onClick={handleSwap} className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-transform hover:scale-110 md:rotate-0 rotate-90">
                <ArrowRightLeft size={20} />
              </button>
            </div>
            <div>
              <label htmlFor="output-data" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output</label>
              <div className="relative">
                <textarea id="output-data" readOnly value={output} rows={10} className={`w-full p-3 font-mono text-sm border rounded-lg resize-y bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 cursor-default ${error ? 'border-red-500' : ''}`} />
                <div className="absolute top-3 right-3"><CopyButton valueToCopy={output} ariaLabel="Copy Output" /></div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">
              <Upload size={18} /> Upload File
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".csv,.json" />
            <button onClick={handleDownload} disabled={!output || !!error} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400">
              <Download size={18} /> Download Output
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
