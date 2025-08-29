'use client';

import { useState, useCallback, useMemo, ChangeEvent, useEffect } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, X, Plus, ArrowDown } from 'lucide-react';

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
            return { protocol: '', hostname: '', port: '', pathname: '', search: '', hash: '', query: {}, isValid: false };
        }
    }, [urlInput]);

    const builtUrl = useMemo(() => {
        try {
            let urlString = builderProtocol;
            urlString += builderHost;
            if (builderPort) urlString += `:${builderPort}`;
            urlString += builderPath.startsWith('/') ? builderPath : `/${builderPath}`;

            const params = builderQueryParams.filter(p => p.key.trim() !== '');
            if (params.length > 0) {
                const query = new URLSearchParams();
                params.forEach(p => query.append(p.key, p.value));
                urlString += `?${query.toString()}`;
            }

            if (builderHash) urlString += `#${builderHash.startsWith('#') ? builderHash.substring(1) : builderHash}`;

            new URL(urlString);
            return urlString;
        } catch (e) {
            return 'Invalid URL components';
        }
    }, [builderProtocol, builderHost, builderPort, builderPath, builderQueryParams, builderHash]);

    const handleAddQueryParam = useCallback(() => {
        triggerHapticFeedback();
        setBuilderQueryParams((prev) => [...prev, { key: '', value: '' }]);
    }, []);

    const handleRemoveQueryParam = useCallback((index: number) => {
        triggerHapticFeedback();
        setBuilderQueryParams((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleQueryParamChange = useCallback((index: number, field: 'key' | 'value', val: string) => {
        triggerHapticFeedback();
        setBuilderQueryParams((prev) => prev.map((param, i) => (i === index ? { ...param, [field]: val } : param)));
    }, []);

    const handleClearParser = useCallback(() => {
        triggerHapticFeedback();
        setUrlInput('');
    }, []);

    const handleClearBuilder = useCallback(() => {
        triggerHapticFeedback();
        setBuilderProtocol('https://');
        setBuilderHost('');
        setBuilderPort('');
        setBuilderPath('');
        setBuilderQueryParams([{ key: '', value: '' }]);
        setBuilderHash('');
    }, []);

    const loadParsedToBuilder = () => {
        triggerHapticFeedback();
        if (parsedUrl.isValid) {
            setBuilderProtocol(parsedUrl.protocol + '//');
            setBuilderHost(parsedUrl.hostname);
            setBuilderPort(parsedUrl.port);
            setBuilderPath(parsedUrl.pathname);
            setBuilderHash(parsedUrl.hash.substring(1));
            const query = Object.entries(parsedUrl.query);
            setBuilderQueryParams(query.length > 0 ? query.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        }
    };

    return (
        <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">URL Parser & Builder</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Deconstruct and build URLs with ease.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">URL Parser</h2>
                        <div className="flex items-center gap-2 mb-4">
                            <input type="text" id="url-input" value={urlInput} onFocus={triggerHapticFeedback} onChange={(e) => { setUrlInput(e.target.value); triggerHapticFeedback(); }} placeholder="e.g., https://example.com/path?query=value#hash" className="flex-grow p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <CopyButton valueToCopy={urlInput} ariaLabel="Copy URL input" />
                        </div>

                        {!parsedUrl.isValid && urlInput.trim() !== '' && (
                            <p className="text-red-600 dark:text-red-400 text-sm mb-4">Invalid URL. Please enter a valid URL.</p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {[{ label: 'Protocol', value: parsedUrl.protocol }, { label: 'Hostname', value: parsedUrl.hostname }, { label: 'Port', value: parsedUrl.port }, { label: 'Pathname', value: parsedUrl.pathname }, { label: 'Search', value: parsedUrl.search }, { label: 'Hash', value: parsedUrl.hash }].map((field) => (
                                <div key={field.label}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                                    <div className="flex items-center gap-2">
                                        <input type="text" readOnly value={field.value} className="flex-grow p-2.5 font-mono text-base border rounded-lg bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 cursor-default" placeholder="N/A" />
                                        <CopyButton valueToCopy={field.value} ariaLabel={`Copy ${field.label}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <button onClick={loadParsedToBuilder} disabled={!parsedUrl.isValid} className="px-4 py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center gap-2 disabled:bg-gray-400">
                                <ArrowDown size={16} /> Load to Builder
                            </button>
                            <button onClick={handleClearParser} className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors">Clear</button>
                        </div>
                    </div>

                    <hr className="my-8 border-t border-gray-300 dark:border-gray-600" />

                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">URL Builder</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label htmlFor="builder-protocol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Protocol</label>
                                <select id="builder-protocol" value={builderProtocol} onFocus={triggerHapticFeedback} onChange={(e) => { setBuilderProtocol(e.target.value); triggerHapticFeedback(); }} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="http://">http://</option>
                                    <option value="https://">https://</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="builder-host" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hostname</label>
                                <input type="text" id="builder-host" value={builderHost} onFocus={triggerHapticFeedback} onChange={(e) => { setBuilderHost(e.target.value); triggerHapticFeedback(); }} placeholder="e.g., www.example.com" className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="builder-port" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Port</label>
                                <input type="text" id="builder-port" value={builderPort} onFocus={triggerHapticFeedback} onChange={(e) => { setBuilderPort(e.target.value.replace(/[^0-9]/g, '')); triggerHapticFeedback(); }} placeholder="e.g., 8080" className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                                <label htmlFor="builder-path" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pathname</label>
                                <input type="text" id="builder-path" value={builderPath} onFocus={triggerHapticFeedback} onChange={(e) => { setBuilderPath(e.target.value); triggerHapticFeedback(); }} placeholder="e.g., /path/to/resource" className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="builder-hash" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hash</label>
                                <input type="text" id="builder-hash" value={builderHash} onFocus={triggerHapticFeedback} onChange={(e) => { setBuilderHash(e.target.value); triggerHapticFeedback(); }} placeholder="e.g., section-id" className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Query Parameters</h3>
                        {builderQueryParams.map((param, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <input type="text" value={param.key} onFocus={triggerHapticFeedback} onChange={(e) => handleQueryParamChange(index, 'key', e.target.value)} placeholder="Key" className="w-1/2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <span className="text-gray-700 dark:text-gray-300">=</span>
                                <input type="text" value={param.value} onFocus={triggerHapticFeedback} onChange={(e) => handleQueryParamChange(index, 'value', e.target.value)} placeholder="Value" className="w-1/2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <button onClick={() => handleRemoveQueryParam(index)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md"><X size={16} /></button>
                            </div>
                        ))}
                        <button onClick={handleAddQueryParam} className="px-4 py-2 mt-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-md shadow flex items-center gap-2"><Plus size={16} /> Add Parameter</button>

                        <div className="mt-6">
                            <label htmlFor="built-url-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Built URL</label>
                            <div className="flex items-center gap-2">
                                <input type="text" id="built-url-output" readOnly value={builtUrl} className="flex-grow p-3 font-mono text-base border rounded-lg bg-gray-100 dark:bg-gray-900/50 dark:border-gray-700 cursor-default" placeholder="Constructed URL..." />
                                <CopyButton valueToCopy={builtUrl} ariaLabel="Copy built URL" />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={handleClearBuilder} className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md">Reset Builder</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
