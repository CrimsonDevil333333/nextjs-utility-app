'use client';

import { useState, useEffect } from 'react';
import { Search, LocateFixed } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (ipToLookup?: string) => {
    const targetIp = ipToLookup === undefined ? ipAddress : ipToLookup;
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
      if(ipToLookup === '') setIpAddress(data.query); // Set the detected IP in the input
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Automatically look up the user's IP on page load
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">IP Geolocation 📍</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Find the geographical location of an IP address.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          placeholder="Enter IP Address or leave blank for yours"
          className="flex-grow p-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Search size={24} />}
        </button>
      </form>

      {error && (
        <div className="p-4 text-center bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {geoData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <div className="w-full aspect-square lg:aspect-auto rounded-lg overflow-hidden shadow-lg">
                <iframe
                    width="100%"
                    height="100%"
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${geoData.lon-0.1},${geoData.lat-0.1},${geoData.lon+0.1},${geoData.lat+0.1}&layer=mapnik&marker=${geoData.lat},${geoData.lon}`}
                ></iframe>
            </div>
        </div>
      )}
    </div>
  );
};

export default IpGeolocationPage;
