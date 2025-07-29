'use client';

import { useState, useMemo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

// Function to calculate luminance from a hex color
function getLuminance(hex: string): number {
  const rgb = parseInt(hex.substring(1), 16);
  const r = ((rgb >> 16) & 0xff) / 255;
  const g = ((rgb >> 8) & 0xff) / 255;
  const b = ((rgb >> 0) & 0xff) / 255;

  const sR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const sG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const sB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

const WCAG_LEVELS = {
  AA_NORMAL: { ratio: 4.5, label: 'AA (Normal Text)' },
  AA_LARGE: { ratio: 3, label: 'AA (Large Text)' },
  AAA_NORMAL: { ratio: 7, label: 'AAA (Normal Text)' },
  AAA_LARGE: { ratio: 4.5, label: 'AAA (Large Text)' },
};

const ColorContrastCheckerPage = () => {
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState('#0000FF');

  const { contrastRatio, results } = useMemo(() => {
    const lum1 = getLuminance(textColor);
    const lum2 = getLuminance(bgColor);
    const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

    const checkResults = Object.entries(WCAG_LEVELS).reduce((acc, [key, value]) => {
      acc[key] = ratio >= value.ratio;
      return acc;
    }, {} as Record<string, boolean>);
    
    return {
      contrastRatio: ratio,
      results: checkResults
    };
  }, [textColor, bgColor]);
  
  const StatusPill = ({ passed }: { passed: boolean }) => (
    <span className={`px-3 py-1 text-sm font-bold rounded-full ${passed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
      {passed ? <CheckCircle className="inline-block w-4 h-4 mr-1" /> : <XCircle className="inline-block w-4 h-4 mr-1" />}
      {passed ? 'Pass' : 'Fail'}
    </span>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Color Contrast Checker 👁️‍🗨️</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Check color contrast against WCAG accessibility standards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Color Pickers */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <label htmlFor="textColor" className="font-semibold text-lg w-32">Text Color</label>
            <input id="textColor" type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-16 h-12 p-1 border-none rounded-lg cursor-pointer" />
            <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)} className="p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800" />
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="bgColor" className="font-semibold text-lg w-32">Background</label>
            <input id="bgColor" type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-16 h-12 p-1 border-none rounded-lg cursor-pointer" />
            <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className="p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800" />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-8 text-center" style={{ backgroundColor: bgColor, color: textColor }}>
                <h3 className="text-2xl font-bold">Preview Text</h3>
                <p className="mt-2 text-lg">Large text is easier to read.</p>
                <p className="mt-1">Normal text requires higher contrast.</p>
            </div>
        </div>
      </div>
      
      {/* Results Section */}
      <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">Contrast Ratio</h2>
          <p className="text-6xl font-extrabold text-gray-900 dark:text-white">{contrastRatio.toFixed(2)}:1</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(WCAG_LEVELS).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{value.label}</span>
                    <StatusPill passed={results[key]} />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ColorContrastCheckerPage;
