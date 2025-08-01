'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, LocateFixed } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

interface GeolocationData {
  query: string;
  country: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  isp: string;
  org: string;
}

const IpGeolocationPage = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [geoData, setGeoData] = useState<GeolocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true for initial lookup
  const [error, setError] = useState<string | null>(null);

  const handleLookup = useCallback(async (ipToLookup?: string) => {
    triggerHapticFeedback();
    const targetIp = ipToLookup === undefined ? ipAddress : ipToLookup;

    // Allow empty string for initial lookup, but show error if user clears and searches
    if (!targetIp && ipToLookup !== '') {
      setError('Please enter an IP address.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeoData(null);

    try {
      const response = await fetch(`/api/ip?ip=${encodeURIComponent(targetIp)}`);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = typeof errorData === 'object' && errorData !== null && 'error' in errorData
          ? (errorData as { error?: string }).error
          : undefined;
        throw new Error(errorMsg || 'An unknown error occurred.');
      }
      const data: GeolocationData = await response.json();
      setGeoData(data);
      if (ipToLookup === '') setIpAddress(data.query);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [ipAddress]);

  useEffect(() => {
    handleLookup('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup();
  };

  const InfoRow = ({ label, value }: { label: string, value?: string | number }) => (
    value ? (
      <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <span className="font-semibold text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-gray-900 dark:text-white text-right">{value}</span>
      </div>
    ) : null
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">IP Geolocation 📍</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Find the geographical location of an IP address.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={ipAddress}
              onFocus={triggerHapticFeedback}
              onChange={(e) => { setIpAddress(e.target.value); triggerHapticFeedback(); }}
              placeholder="Enter IP or leave blank for yours"
              className="flex-grow p-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleLookup('')}
                disabled={isLoading}
                className="p-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center transition-colors"
                title="Find My IP"
              >
                <LocateFixed size={24} />
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-grow px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400/50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Search size={24} />}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 text-center bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {isLoading && !geoData && (
            <div className="text-center py-10">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Fetching geolocation data...</p>
            </div>
          )}

          {geoData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <h2 className="text-2xl font-bold p-4 border-b border-gray-200 dark:border-gray-700">Location Details</h2>
                <dl>
                  <InfoRow label="IP Address" value={geoData.query} />
                  <InfoRow label="City" value={geoData.city} />
                  <InfoRow label="Region" value={geoData.regionName} />
                  <InfoRow label="Country" value={geoData.country} />
                  <InfoRow label="Postal Code" value={geoData.zip} />
                  <InfoRow label="ISP" value={geoData.isp} />
                  <InfoRow label="Organization" value={geoData.org} />
                </dl>
              </div>
              <div className="w-full h-64 lg:h-full rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${geoData.lon - 0.1},${geoData.lat - 0.1},${geoData.lon + 0.1},${geoData.lat + 0.1}&layer=mapnik&marker=${geoData.lat},${geoData.lon}`}
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IpGeolocationPage;
