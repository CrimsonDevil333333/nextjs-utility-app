// app/csv-json-converter/page.tsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react'; // Import useEffect

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

type Mode = 'csvToJson' | 'jsonToCsv';

export default function CsvJsonConverterPage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('csvToJson');
  const [error, setError] = useState<string | null>(null);

  const convertCsvToJson = (csv: string): string => {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return '[]';

    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const obj: { [key: string]: string | number | boolean | null } = {}; // Allow various types
      const currentLine = parseCsvLine(lines[i]); // Use improved CSV line parsing

      if (currentLine.length !== headers.length) {
        throw new Error(`Row ${i + 1} has ${currentLine.length} columns, but expected ${headers.length}. Check for missing values or unescaped commas.`);
      }

      for (let j = 0; j < headers.length; j++) {
        const key = headers[j];
        const rawValue = currentLine[j].trim();
        
        // Basic type inference: try to convert to number, boolean, or null
        if (rawValue === 'true') {
            obj[key] = true;
        } else if (rawValue === 'false') {
            obj[key] = false;
        } else if (rawValue === 'null' || rawValue === '') { // Treat empty string as null
            obj[key] = null;
        } else if (!isNaN(Number(rawValue)) && !isNaN(parseFloat(rawValue))) {
            obj[key] = Number(rawValue);
        } else {
            obj[key] = rawValue;
        }
      }
      result.push(obj);
    }
    return JSON.stringify(result, null, 2); // Pretty print JSON
  };

  // Improved CSV line parsing to handle quoted commas and escaped quotes
  const parseCsvLine = (line: string): string[] => {
    const values: string[] = [];
    let inQuote = false;
    let currentField = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuote && line[i + 1] === '"') { // Handle escaped double quote ""
          currentField += '"';
          i++; // Skip the next quote
        } else {
          inQuote = !inQuote;
        }
      } else if (char === ',' && !inQuote) {
        values.push(currentField);
        currentField = '';
      } else {
        currentField += char;
      }
    }
    values.push(currentField); // Push the last field
    return values;
  };

  const convertJsonToCsv = (json: string): string => {
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('JSON must be an array of objects.');
      }

      // Collect all possible headers from all objects to handle inconsistent keys
      const allHeaders = new Set<string>();
      parsed.forEach(item => {
        Object.keys(item).forEach(key => allHeaders.add(key));
      });
      const headers = Array.from(allHeaders); // Get unique sorted headers

      const csvLines = [headers.map(h => {
        // Enclose headers with commas or quotes in quotes
        if (h.includes(',') || h.includes('"')) return `"${h.replace(/"/g, '""')}"`;
        return h;
      }).join(',')]; // Header row

      parsed.forEach(item => {
        const values = headers.map(header => {
          const value = item[header];
          // Handle null/undefined values
          if (value === null || typeof value === 'undefined') {
            return ''; // Represent null/undefined as empty string in CSV
          }
          
          const stringValue = String(value);

          // Handle commas and quotes in values for CSV export
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
            return `"${stringValue.replace(/"/g, '""')}"`; // Double quotes and wrap in quotes
          }
          return stringValue;
        });
        csvLines.push(values.join(','));
      });
      return csvLines.join('\n');
    } catch (e: any) {
      throw new Error(`Invalid JSON for CSV conversion: ${e.message}`);
    }
  };

  const output = useMemo(() => {
    setError(null); // Clear previous errors
    if (!input.trim()) return '';

    try {
      if (mode === 'csvToJson') {
        return convertCsvToJson(input);
      } else {
        return convertJsonToCsv(input);
      }
    } catch (e: any) {
      setError(e.message);
      return '';
    }
  }, [input, mode]); // Only depends on input and mode


  const handleClear = useCallback(() => {
    setInput('');
    setError(null);
  }, []);

  // Use useEffect to set example input when mode changes or on initial render
  useEffect(() => {
    if (mode === 'csvToJson') {
      setInput('name,age,city,isStudent\n"John Doe",30,"New York, USA",true\nJane Smith,25,"London, UK",false\nPeter Pan,null,Neverland,""'); // Added more complex CSV examples
    } else {
      setInput('[{"name":"John Doe","age":30,"city":"New York, USA","isStudent":true},{"name":"Jane Smith","age":25,"city":"London, UK","isStudent":false},{"name":"Peter Pan","age":null,"city":"Neverland","isStudent":""}]'); // Added complex JSON with comma in value, null, boolean, and empty string
    }
  }, [mode]); // Dependency on mode ensures it updates when mode changes


  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">CSV & JSON Converter</h1>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        {/* Mode Switch */}
        <div className="flex justify-center mb-6">
          <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
            <button
              onClick={() => setMode('csvToJson')}
              className={`
                px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                ${mode === 'csvToJson'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              CSV to JSON
            </button>
            <button
              onClick={() => setMode('jsonToCsv')}
              className={`
                px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                ${mode === 'jsonToCsv'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              JSON to CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 text-red-800 bg-red-100 border border-red-300 rounded-lg dark:text-red-300 dark:bg-red-900/50 dark:border-red-600">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Textarea */}
          <div>
            <label htmlFor="input-data" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mode === 'csvToJson' ? 'Enter CSV Data' : 'Enter JSON Data'}
            </label>
            <div className="relative">
              <textarea
                id="input-data"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'csvToJson' ? 'e.g., name,age,city\nJohn Doe,30,"New York, USA"' : 'e.g., [{"name":"Alice", "age":30}]'}
                rows={10}
                className={`
                  w-full p-2.5 font-mono text-sm border rounded-lg resize-y
                  bg-gray-50 dark:bg-gray-700 dark:border-gray-600
                  text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition-all duration-200 ease-in-out
                  ${error ? 'border-red-500 ring-red-500' : ''}
                `}
              />
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                aria-label="Clear input"
                title="Clear Input"
                disabled={!input.trim()}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Output Textarea */}
          <div>
            <label htmlFor="output-data" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mode === 'csvToJson' ? 'JSON Output (Formatted)' : 'CSV Output'}
            </label>
            <div className="relative">
              <textarea
                id="output-data"
                readOnly
                value={output}
                placeholder="Converted data will appear here..."
                rows={10}
                className={`
                  w-full p-2.5 font-mono text-sm border rounded-lg resize-y
                  bg-gray-100 dark:bg-gray-900 dark:border-gray-700
                  text-gray-800 dark:text-gray-200
                  cursor-default select-all /* Added select-all */
                  focus:outline-none
                  ${error ? 'border-red-500 ring-red-500' : ''}
                `}
              />
              <div className="absolute top-3 right-3">
                <CopyButton valueToCopy={output} ariaLabel="Copy converted data" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}