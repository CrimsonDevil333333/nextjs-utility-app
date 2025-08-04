'use client';

import { useState, useCallback, useMemo } from 'react';
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

// --- XML Formatting Logic ---

const formatXml = (xml: string, indent: string) => {
  let formatted = '';
  const regex = /(>)(<)(\/?)/g;
  const xmlFormatted = xml.replace(regex, '$1\r\n$2$3');
  let pad = 0;
  const nodes = xmlFormatted.split('\r\n');

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    let indentChar = '';

    if (node.match(/<\/\w/) || node.match(/<.+\/>/)) {
      pad -= 1;
    }

    for (let j = 0; j < pad; j++) {
      indentChar += indent;
    }

    formatted += indentChar + node + '\r\n';

    if (node.match(/<\w[^>]*[^\/]>($|<\/\w)/) && !node.match(/<\/\w/)) {
      pad += 1;
    }
  }
  return formatted.trim();
};

const highlightXml = (xml: string) => {
  return xml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(".*?")/g, '<span class="text-green-500">$1</span>')
    .replace(/(&lt;\/?)(.*?)(&gt;)/g, '<span class="text-gray-500">$1</span><span class="text-red-500">$2</span><span class="text-gray-500">$3</span>');
};

export default function XmlFormatterPage() {
  const [xmlInput, setXmlInput] = useState<string>(
    '<root><item id="1"><name>Product A</name><price>10.00</price></item><item id="2"><name>Product B</name><price>20.50</price></item></root>'
  );
  const [indentation, setIndentation] = useState('    '); // 4 spaces
  const [error, setError] = useState<string | null>(null);

  const formattedXml = useMemo(() => {
    setError(null);
    if (!xmlInput.trim()) return '';
    try {
      if (!xmlInput.trim().startsWith('<') || !xmlInput.trim().endsWith('>')) {
        throw new Error('Input does not appear to be valid XML.');
      }
      return formatXml(xmlInput, indentation);
    } catch (e: any) {
      setError(`Error formatting XML: ${e.message}`);
      return '';
    }
  }, [xmlInput, indentation]);

  const handleClear = useCallback(() => {
    triggerHapticFeedback();
    setXmlInput('');
    setError(null);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">XML Formatter & Viewer</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Format, validate, and beautify your XML data.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="xml-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input XML</label>
              <div className="relative">
                <textarea
                  id="xml-input"
                  value={xmlInput}
                  onFocus={triggerHapticFeedback}
                  onChange={(e) => { setXmlInput(e.target.value); triggerHapticFeedback(); }}
                  placeholder="Paste your XML here..."
                  rows={10}
                  className="w-full p-3 font-mono text-base border rounded-lg resize-y bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {xmlInput && <button onClick={handleClear} className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600"><X size={16} /></button>}
              </div>
              {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
            </div>
            <div>
              <label htmlFor="formatted-xml-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Formatted XML</label>
              <div className="relative">
                <pre className="w-full h-[258px] p-3 font-mono text-base border rounded-lg overflow-auto bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700">
                  <code dangerouslySetInnerHTML={{ __html: highlightXml(formattedXml) }} />
                </pre>
                <div className="absolute top-3 right-3">
                  <CopyButton valueToCopy={formattedXml} ariaLabel="Copy formatted XML" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-4">
              <label htmlFor="indentation" className="text-sm font-medium text-gray-700 dark:text-gray-300">Indentation</label>
              <select id="indentation" value={indentation} onFocus={triggerHapticFeedback} onChange={(e) => { setIndentation(e.target.value); triggerHapticFeedback(); }} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                <option value="    ">4 Spaces</option>
                <option value="  ">2 Spaces</option>
                <option value="\t">Tabs</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
