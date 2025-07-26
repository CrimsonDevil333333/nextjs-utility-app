// app/url-parser/page.tsx
'use client';

import { useState, useCallback, useMemo, ChangeEvent, useEffect } from 'react';

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

interface ParsedUrl {
    protocol: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    query: Record<string, string>;
    isValid: boolean;
}

export default function UrlParserPage() {
    const [urlInput, setUrlInput] = useState<string>('https://www.example.com:8080/path/to/page?param1=value1&param2=value2#section');

    // States for URL builder
    const [builderProtocol, setBuilderProtocol] = useState('https://');
    const [builderHost, setBuilderHost] = useState('www.example.com');
    const [builderPort, setBuilderPort] = useState('');
    const [builderPath, setBuilderPath] = useState('/new/path');
    const [builderQueryParams, setBuilderQueryParams] = useState([{ key: 'key1', value: 'value1' }]);
    const [builderHash, setBuilderHash] = useState('section');

    const parsedUrl: ParsedUrl = useMemo(() => {
        try {
            const url = new URL(urlInput);
            const queryParams: Record<string, string> = {};
            url.searchParams.forEach((value, key) => {
                queryParams[key] = value;
            });
            return {
                protocol: url.protocol,
                hostname: url.hostname,
                port: url.port,
                pathname: url.pathname,
                search: url.search,
                hash: url.hash,
                query: queryParams,
                isValid: true,
            };
        } catch (e) {
            return {
                protocol: '',
                hostname: '',
                port: '',
                pathname: '',
                search: '',
                hash: '',
                query: {},
                isValid: false,
            };
        }
    }, [urlInput]);

    const builtUrl = useMemo(() => {
        try {
            let urlString = builderProtocol;
            urlString += builderHost;
            if (builderPort) {
                urlString += `:${builderPort}`;
            }
            urlString += builderPath.startsWith('/') ? builderPath : `/${builderPath}`;

            const params = builderQueryParams.filter(p => p.key.trim() !== '');
            if (params.length > 0) {
                const query = new URLSearchParams();
                params.forEach(p => query.append(p.key, p.value));
                urlString += `?${query.toString()}`;
            }

            if (builderHash) {
                urlString += `#${builderHash.startsWith('#') ? builderHash.substring(1) : builderHash}`;
            }

            // Basic validation for URL construction
            new URL(urlString); // Throws if invalid
            return urlString;
        } catch (e) {
            return 'Invalid URL components';
        }
    }, [builderProtocol, builderHost, builderPort, builderPath, builderQueryParams, builderHash]);


    const handleAddQueryParam = useCallback(() => {
        setBuilderQueryParams((prev) => [...prev, { key: '', value: '' }]);
    }, []);

    const handleRemoveQueryParam = useCallback((index: number) => {
        setBuilderQueryParams((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleQueryParamChange = useCallback((index: number, field: 'key' | 'value', val: string) => {
        setBuilderQueryParams((prev) =>
            prev.map((param, i) => (i === index ? { ...param, [field]: val } : param))
        );
    }, []);

    const handleClearParser = useCallback(() => {
        setUrlInput('');
    }, []);

    const handleClearBuilder = useCallback(() => {
        setBuilderProtocol('https://');
        setBuilderHost('www.example.com');
        setBuilderPort('');
        setBuilderPath('/new/path');
        setBuilderQueryParams([{ key: 'key1', value: 'value1' }]);
        setBuilderHash('section');
    }, []);


    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">URL Parser & Builder</h1>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">URL Parser</h2>
                    <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enter URL to parse
                    </label>
                    <div className="flex items-center gap-2 mb-4"> {/* Use flexbox for alignment */}
                        <input
                            type="text"
                            id="url-input"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="e.g., https://example.com/path?query=value#hash"
                            className="flex-grow p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
                        />
                        <CopyButton valueToCopy={urlInput} ariaLabel="Copy URL input" />
                    </div>

                    {!parsedUrl.isValid && urlInput.trim() !== '' && (
                        <p className="text-red-600 dark:text-red-400 text-sm mb-4">Invalid URL. Please enter a valid URL (e.g., `http://example.com`).</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {[
                            { label: 'Protocol', value: parsedUrl.protocol },
                            { label: 'Hostname', value: parsedUrl.hostname },
                            { label: 'Port', value: parsedUrl.port },
                            { label: 'Pathname', value: parsedUrl.pathname },
                            { label: 'Search (Query String)', value: parsedUrl.search },
                            { label: 'Hash', value: parsedUrl.hash },
                        ].map((field) => (
                            <div key={field.label}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                                <div className="flex items-center gap-2"> {/* Use flexbox here too */}
                                    <input
                                        type="text"
                                        readOnly
                                        value={field.value}
                                        className="flex-grow p-2.5 font-mono text-base border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default select-all"
                                        placeholder="N/A"
                                    />
                                    <CopyButton valueToCopy={field.value} ariaLabel={`Copy ${field.label}`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Query Parameters:</h3>
                        {Object.keys(parsedUrl.query).length > 0 ? (
                            <ul className="list-disc list-inside bg-gray-100 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                {Object.entries(parsedUrl.query).map(([key, value]) => (
                                    <li key={key} className="text-gray-800 dark:text-gray-200 font-mono text-sm">
                                        <span className="font-semibold">{key}:</span> {value}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">No query parameters found.</p>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleClearParser}
                            className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                            aria-label="Clear parser input"
                            title="Clear Parser Input"
                        >
                            Clear Parser Input
                        </button>
                    </div>
                </div>

                <hr className="my-8 border-t border-gray-300 dark:border-gray-600" />

                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">URL Builder</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label htmlFor="builder-protocol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Protocol
                            </label>
                            <select
                                id="builder-protocol"
                                value={builderProtocol}
                                onChange={(e) => setBuilderProtocol(e.target.value)}
                                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="http://">http://</option>
                                <option value="https://">https://</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="builder-host" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Hostname
                            </label>
                            <input
                                type="text"
                                id="builder-host"
                                value={builderHost}
                                onChange={(e) => setBuilderHost(e.target.value)}
                                placeholder="e.g., www.example.com"
                                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="builder-port" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Port (Optional)
                            </label>
                            <input
                                type="text"
                                id="builder-port"
                                value={builderPort}
                                onChange={(e) => setBuilderPort(e.target.value.replace(/[^0-9]/g, ''))} // Only numbers
                                placeholder="e.g., 8080"
                                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="col-span-1 sm:col-span-2"> {/* Pathname takes more space */}
                            <label htmlFor="builder-path" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Pathname
                            </label>
                            <input
                                type="text"
                                id="builder-path"
                                value={builderPath}
                                onChange={(e) => setBuilderPath(e.target.value)}
                                placeholder="e.g., /path/to/resource"
                                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="builder-hash" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Hash (Fragment)
                            </label>
                            <input
                                type="text"
                                id="builder-hash"
                                value={builderHash}
                                onChange={(e) => setBuilderHash(e.target.value)}
                                placeholder="e.g., section-id"
                                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Query Parameters</h3>
                    {builderQueryParams.map((param, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={param.key}
                                onChange={(e) => handleQueryParamChange(index, 'key', e.target.value)}
                                placeholder="Key"
                                className="w-1/2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300">=</span>
                            <input
                                type="text"
                                value={param.value}
                                onChange={(e) => handleQueryParamChange(index, 'value', e.target.value)}
                                placeholder="Value"
                                className="w-1/2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={() => handleRemoveQueryParam(index)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                                aria-label="Remove query parameter"
                                title="Remove Parameter"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={handleAddQueryParam}
                        className="px-4 py-2 mt-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-md shadow transition-colors"
                    >
                        Add Query Parameter
                    </button>

                    <div className="mt-6"> {/* Removed relative from outer div */}
                        <label htmlFor="built-url-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Built URL
                        </label>
                        <div className="flex items-center gap-2"> {/* Use flexbox here */}
                            <input
                                type="text"
                                id="built-url-output"
                                readOnly
                                value={builtUrl}
                                className="flex-grow p-2.5 font-mono text-base border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default select-all"
                                placeholder="Constructed URL will appear here..."
                            />
                            <CopyButton valueToCopy={builtUrl} ariaLabel="Copy built URL" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleClearBuilder}
                            className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                            aria-label="Reset builder fields"
                            title="Reset Builder Fields"
                        >
                            Reset Builder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}