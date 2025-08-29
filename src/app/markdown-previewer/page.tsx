'use client';

import { useState, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, X } from 'lucide-react';

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

const MarkdownPreviewerPage = () => {
    const [markdown, setMarkdown] = useState('# Hello, Markdown!\n\nThis is a real-time previewer.\n\n- Lists are supported\n- **Bold** and *italic* text too!\n\n```javascript\nconsole.log("Code blocks!");\n```');

    const stats = useMemo(() => {
        const words = markdown.trim().split(/\s+/).filter(Boolean).length;
        const chars = markdown.length;
        const lines = markdown.split('\n').length;
        return { words, chars, lines };
    }, [markdown]);

    const handleClear = () => {
        triggerHapticFeedback();
        setMarkdown('');
    };

    return (
        <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Markdown Previewer</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Write Markdown on the left and see the rendered HTML on the right.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="grid md:grid-cols-2 gap-4 h-[60dvh] min-h-[500px]">
                        <div className="relative">
                            <textarea
                                value={markdown}
                                onFocus={triggerHapticFeedback}
                                onChange={(e) => { setMarkdown(e.target.value); triggerHapticFeedback(); }}
                                className="w-full h-full p-3 border rounded-md font-mono dark:bg-gray-900 dark:border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Markdown Input"
                            />
                            <div className="absolute top-3 right-3 flex gap-2">
                                <CopyButton valueToCopy={markdown} ariaLabel="Copy Markdown" />
                                <button onClick={handleClear} className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md"><X size={16} /></button>
                            </div>
                            <div className="absolute bottom-3 right-3 flex gap-4 text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-md">
                                <span>Chars: {stats.chars}</span>
                                <span>Words: {stats.words}</span>
                                <span>Lines: {stats.lines}</span>
                            </div>
                        </div>
                        <div className="markdown-body prose dark:prose-invert max-w-none p-4 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-y-auto">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarkdownPreviewerPage;
