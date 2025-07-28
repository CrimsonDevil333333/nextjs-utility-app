'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownPreviewerPage = () => {
    const [markdown, setMarkdown] = useState('# Hello, Markdown!\n\nThis is a real-time previewer.\n\n- Lists are supported\n- **Bold** and *italic* text too!\n\n```javascript\nconsole.log("Code blocks!");\n```');

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Markdown Previewer</h1>
            <div className="grid md:grid-cols-2 gap-4 h-[60vh] min-h-[400px]">
                <textarea 
                    value={markdown} 
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="w-full h-full p-3 border rounded-md font-mono dark:bg-gray-700 dark:border-gray-600 resize-none" 
                    aria-label="Markdown Input"
                />
                {/* UPDATE THIS LINE: Replace 'prose' with 'markdown-body' */}
                <div className="markdown-body p-4 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 overflow-y-auto">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default MarkdownPreviewerPage;