// app/xml-formatter/page.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';

// Reusable CopyButton component (assuming it's available or define it here if not)
function CopyButton({ valueToCopy, ariaLabel }: { valueToCopy: string; ariaLabel: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        if (valueToCopy) {
            try {
                await navigator.clipboard.writeText(valueToCopy);
                setCopied(true);
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
            className={`
                px-4 py-2 text-sm font-medium rounded-md
                flex items-center space-x-2
                transition-all duration-200 ease-in-out
                ${isValueEmpty
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                }
            `}
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            {copied ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Copy</span>
                </>
            )}
        </button>
    );
}

const formatXml = (xml: string) => {
  let formatted = '';
  const regex = /(>)(<)(\/?)/g;
  const xmlFormatted = xml.replace(regex, '$1\r\n$2$3');
  let pad = 0;
  const nodes = xmlFormatted.split('\r\n');
  const indent = '    '; // 4 spaces

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    let indentChar = '';
    
    // Decrease indent for closing tags or self-closing tags (if not followed by content)
    if (node.match( /<\/\w/ ) || node.match( /<.+\/>/ )) { // </tag> or <tag/>
      pad -= 1;
    }
    
    // Add current indentation
    for (let j = 0; j < pad; j++) {
      indentChar += indent;
    }

    formatted += indentChar + node + '\r\n';

    // Increase indent for opening tags (if not self-closing or closing)
    if (node.match( /<\w[^>]*[^\/]>($|<\/\w)/) && !node.match( /<\/\w/ )) { // <tag> but not </tag> or <tag/>
      pad += 1;
    }
  }
  return formatted.trim();
};

export default function XmlFormatterPage() {
  const [xmlInput, setXmlInput] = useState<string>(
    '<root><item id="1"><name>Product A</name><price>10.00</price></item><item id="2"><name>Product B</name><price>20.50</price></item></root>'
  );
  const [formattedXml, setFormattedXml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFormat = useCallback(() => {
    setError(null);
    if (!xmlInput.trim()) {
      setFormattedXml('');
      return;
    }
    try {
      // Basic check to see if it looks like XML before attempting to format
      if (!xmlInput.trim().startsWith('<') || !xmlInput.trim().endsWith('>')) {
        throw new Error('Input does not appear to be valid XML. It must start and end with angle brackets.');
      }
      setFormattedXml(formatXml(xmlInput));
    } catch (e: any) {
      setError(`Error formatting XML: ${e.message}`);
      setFormattedXml('');
    }
  }, [xmlInput]);

  const handleClear = useCallback(() => {
    setXmlInput('');
    setFormattedXml('');
    setError(null);
  }, []);

  // Format on initial load or whenever xmlInput changes
  useMemo(() => {
    handleFormat();
  }, [xmlInput, handleFormat]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">XML Formatter & Viewer</h1>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <label htmlFor="xml-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter XML
          </label>
          <textarea
            id="xml-input"
            value={xmlInput}
            onChange={(e) => setXmlInput(e.target.value)}
            placeholder="Paste your XML here..."
            rows={10}
            className="w-full p-2.5 font-mono text-base border rounded-lg resize-y bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        <div className="relative mb-6">
          <label htmlFor="formatted-xml-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Formatted XML
          </label>
          <div className="relative">
            <textarea
              id="formatted-xml-output"
              value={formattedXml}
              readOnly
              rows={10}
              className="w-full p-2.5 font-mono text-base border rounded-lg resize-y bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default select-all pr-12"
              placeholder="Formatted XML will appear here..."
            />
            <div className="absolute top-2 right-2">
              <CopyButton valueToCopy={formattedXml} ariaLabel="Copy formatted XML" />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleFormat}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow transition-colors duration-200 ease-in-out"
          >
            Format XML
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
            aria-label="Clear all fields"
            title="Clear All Fields"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}