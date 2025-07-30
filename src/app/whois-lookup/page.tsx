'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

type WhoisData = Record<string, string | string[]>;

const WhoisLookupPage = () => {
  const [domain, setDomain] = useState('');
  const [whoisData, setWhoisData] = useState<WhoisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) {
      setError('Please enter a domain name.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setWhoisData(null);

    try {
      const response = await fetch(`/api/whois?domain=${encodeURIComponent(domain)}`);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' && errorData !== null && 'error' in errorData
          ? (errorData as { error?: string }).error
          : undefined;
        throw new Error(errorMessage || 'An unknown error occurred.');
      }
      const data = await response.json();
      setWhoisData(data as WhoisData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const ResultRow = ({ label, value }: { label: string, value: string | string[] }) => (
    <div className="py-3 px-4 grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-gray-200 dark:border-gray-700">
      <dt className="font-semibold text-gray-600 dark:text-gray-400">{label}</dt>
      <dd className="md:col-span-2 text-gray-900 dark:text-white break-words">
        {Array.isArray(value) ? value.join(', ') : value}
      </dd>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">WHOIS Lookup 🔍</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Find registration data for any domain name.</p>
      </div>

      <form onSubmit={handleLookup} className="flex gap-2 mb-8">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="e.g., google.com"
          className="flex-grow p-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Search size={24} />
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 text-center bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {whoisData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <h2 className="text-2xl font-bold p-4 border-b border-gray-200 dark:border-gray-700">Results for {whoisData.domainName || domain}</h2>
          <dl>
            {Object.entries(whoisData).map(([key, value]) => (
              <ResultRow key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={value} />
            ))}
          </dl>
        </div>
      )}
    </div>
  );
};

export default WhoisLookupPage;
