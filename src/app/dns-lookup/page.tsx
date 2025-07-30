'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

type DnsRecord = string | { exchange: string; priority: number } | string[];
type RecordType = 'A' | 'AAAA' | 'MX' | 'TXT' | 'NS' | 'CNAME';

const DNS_RECORD_TYPES: RecordType[] = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'];

const DnsLookupPage = () => {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState<RecordType>('A');
  const [dnsData, setDnsData] = useState<DnsRecord[] | null>(null);
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
    setDnsData(null);

    try {
      const response = await fetch(`/api/dns?domain=${encodeURIComponent(domain)}&type=${recordType}`);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = (typeof errorData === 'object' && errorData !== null && 'error' in errorData)
          ? (errorData as { error?: string }).error
          : undefined;
        throw new Error(errorMsg || 'An unknown error occurred.');
      }
      const data = await response.json();
      setDnsData(data as DnsRecord[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRecord = (record: DnsRecord, index: number) => {
    if (typeof record === 'string') {
      return <td className="p-3">{record}</td>;
    }
    if (Array.isArray(record)) { // For TXT records
      return <td className="p-3 break-all">{record.join(' ')}</td>;
    }
    if (typeof record === 'object' && 'exchange' in record) { // For MX records
      return (
        <>
          <td className="p-3">{record.exchange}</td>
          <td className="p-3 text-center">{record.priority}</td>
        </>
      );
    }
    return <td className="p-3">Invalid record format</td>;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">DNS Lookup 🌐</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Find DNS records (A, MX, etc.) for any domain.</p>
      </div>

      <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-2 mb-8">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="e.g., google.com"
          className="flex-grow p-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={recordType}
          onChange={(e) => setRecordType(e.target.value as RecordType)}
          className="p-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {DNS_RECORD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
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

      {dnsData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <h2 className="text-2xl font-bold p-4 border-b border-gray-200 dark:border-gray-700">
            {recordType} Records for {domain}
          </h2>
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="p-3 font-semibold">Value</th>
                {recordType === 'MX' && <th className="p-3 font-semibold text-center">Priority</th>}
              </tr>
            </thead>
            <tbody>
              {dnsData.map((record, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  {renderRecord(record, index)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DnsLookupPage;
