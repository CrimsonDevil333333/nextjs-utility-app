'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

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
    triggerHapticFeedback();
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
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">DNS Lookup 🌐</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Find DNS records for any domain.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={domain}
              onFocus={triggerHapticFeedback}
              onChange={(e) => { setDomain(e.target.value); triggerHapticFeedback(); }}
              placeholder="e.g., google.com"
              className="flex-grow p-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <select
              value={recordType}
              onFocus={triggerHapticFeedback}
              onChange={(e) => { setRecordType(e.target.value as RecordType); triggerHapticFeedback(); }}
              className="p-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {DNS_RECORD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400/50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
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
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <h2 className="text-xl font-bold p-4 border-b border-gray-200 dark:border-gray-700">
                {recordType} Records for {domain}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Value</th>
                      {recordType === 'MX' && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-center">Priority</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {dnsData.map((record, index) => (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        {renderRecord(record, index)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DnsLookupPage;
