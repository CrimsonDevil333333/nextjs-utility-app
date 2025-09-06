"use client"

import { samplePayloads } from './sample-payloads';
import { ChevronDown } from 'lucide-react';

const SamplePayloads = ({ onSelect }: { onSelect: (payload: string) => void }) => {
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPayload = e.target.value;
    if (selectedPayload) {
      onSelect(samplePayloads[selectedPayload as keyof typeof samplePayloads]);
    }
  };

  return (
    <div className="relative">
      <select
        onChange={handleSelect}
        className="appearance-none w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer font-semibold"
        defaultValue=""
      >
        <option value="" disabled>
          Load a sample...
        </option>
        {Object.keys(samplePayloads).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );
};

export default SamplePayloads;
