'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import '@/styles/swagger-dark.css'; // Your custom dark theme
import yaml from 'js-yaml';
import { Editor } from '@monaco-editor/react';
import { Upload, X } from 'lucide-react';
import SamplePayloads from './SamplePayloads';
import { triggerHapticFeedback } from '@/utils/haptics';
import { useTheme } from 'next-themes';

const SwaggerEditorPage = () => {
  const [spec, setSpec] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  const DisableTopbarPlugin = () => {
    return {
      components: {
        Topbar: () => null
      }
    }
  }

  // --- ✅ FIXED: Implemented file reading logic ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result;
      setInputValue(typeof text === 'string' ? text : '');
      triggerHapticFeedback();
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setError("Failed to read the selected file.");
    };

    reader.readAsText(file);
    e.target.value = ''; // Allow re-uploading the same file
  };


  const handleInputChange = (value: string | undefined) => { setInputValue(value || ''); };
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => { /* ... */ }, []);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); };
  const handleReset = () => { triggerHapticFeedback(); setInputValue(''); };
  useEffect(() => { setIsMounted(true); const handleResize = () => { setIsMobile(window.innerWidth < 768); }; handleResize(); window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize); }, []);
  useEffect(() => { const savedInput = localStorage.getItem('swagger-editor-input'); if (savedInput) { setInputValue(savedInput); } }, []);
  useEffect(() => { localStorage.setItem('swagger-editor-input', inputValue); }, [inputValue]);
  useEffect(() => { if (!inputValue.trim()) { setSpec(null); setError(null); return; } try { const parsedSpec = yaml.load(inputValue); setSpec(parsedSpec); setError(null); } catch (e: any) { setError(e.message); setSpec(null); } }, [inputValue]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900 p-4 overflow-hidden">
      <div className="w-full max-w-screen-2xl mx-auto flex flex-col flex-1 min-h-0">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Swagger Editor</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Create, edit, and visualize OpenAPI specifications.</p>
        </div>

        <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 ring-1 ring-black/5 dark:ring-white/10 min-h-0">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <button onClick={() => { fileInputRef.current?.click(); }} className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-150 ease-in-out hover:shadow-lg transform hover:-translate-y-0.5">
              <Upload className="w-5 h-5 mr-2" />
              Upload File
            </button>
            <input type="file" ref={fileInputRef} accept=".yml,.yaml,.json" onChange={handleFileChange} className="hidden" />
            <SamplePayloads onSelect={setInputValue} />
            <button onClick={handleReset} className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-150 ease-in-out hover:shadow-lg transform hover:-translate-y-0.5">
              <X className="w-5 h-5 mr-2" />
              Reset
            </button>
          </div>

          {isMobile && (
            <div className="flex justify-center gap-4 mb-4">
              <button onClick={() => setMobileView('editor')} className={`px-4 py-2 rounded-lg ${mobileView === 'editor' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700'}`}>Editor</button>
              <button onClick={() => setMobileView('preview')} className={`px-4 py-2 rounded-lg ${mobileView === 'preview' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700'}`}>Preview</button>
            </div>
          )}

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-0" onDrop={handleDrop} onDragOver={handleDragOver}>
            <div className={`min-w-0 h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-inner bg-gray-50/50 dark:bg-black/20 ${isMobile && mobileView !== 'editor' ? 'hidden' : ''}`}>
              <Editor
                height="100%"
                language="yaml"
                theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
                value={inputValue}
                onChange={handleInputChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
            <div className={`min-w-0 h-full overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ${resolvedTheme === 'dark' ? 'swagger-container-dark bg-[#24292e]' : 'bg-white'} ${isMobile && mobileView !== 'preview' ? 'hidden' : ''}`}>
              {error ? (
                <div className="text-red-500 p-4 font-mono whitespace-pre-wrap">{error}</div>
              ) : (
                spec && <SwaggerUI spec={spec} plugins={[DisableTopbarPlugin]} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwaggerEditorPage;