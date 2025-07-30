'use client';

import { useState, useEffect } from 'react';
import {UAParser} from 'ua-parser-js';
import { Copy, Check } from 'lucide-react';

const UserAgentFinderPage = () => {
  const [userAgent, setUserAgent] = useState('');
  const [parsedInfo, setParsedInfo] = useState<UAParser.IResult | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const uaString = navigator.userAgent;
    setUserAgent(uaString);
    const parser = new UAParser(uaString);
    setParsedInfo(parser.getResult());
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(userAgent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const InfoRow = ({ label, value }: { label: string, value?: string }) => (
    value ? (
      <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
        <span className="font-semibold text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-gray-900 dark:text-white text-right">{value}</span>
      </div>
    ) : null
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">User-Agent Finder 🕵️</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">View and parse your browser's User-Agent string.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-2">Your User-Agent String</h2>
        <div className="relative p-4 bg-gray-100 dark:bg-gray-900 rounded-md font-mono text-sm break-all">
          {userAgent}
          <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
            {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        {parsedInfo && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Parsed Information</h2>
            <div className="space-y-2">
              <InfoRow label="Browser" value={`${parsedInfo.browser.name} ${parsedInfo.browser.version}`} />
              <InfoRow label="Operating System" value={`${parsedInfo.os.name} ${parsedInfo.os.version}`} />
              <InfoRow label="Engine" value={`${parsedInfo.engine.name} ${parsedInfo.engine.version}`} />
              <InfoRow label="Device" value={parsedInfo.device.vendor ? `${parsedInfo.device.vendor} ${parsedInfo.device.model}` : 'Desktop'} />
              <InfoRow label="CPU Architecture" value={parsedInfo.cpu.architecture} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAgentFinderPage;
