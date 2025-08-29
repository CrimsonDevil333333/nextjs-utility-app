'use client';

import { useState, useMemo, useCallback } from 'react';
import { CheckCircle, XCircle, RefreshCw, Shuffle } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Helper Functions & Constants ---

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

// --- Main Page Component ---

const ColorContrastCheckerPage = () => {
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState('#0000FF');

  const { contrastRatio, results } = useMemo(() => {
    try {
      const lum1 = getLuminance(textColor);
      const lum2 = getLuminance(bgColor);
      const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

      const checkResults = Object.entries(WCAG_LEVELS).reduce((acc, [key, value]) => {
        acc[key as keyof typeof WCAG_LEVELS] = ratio >= value.ratio;
        return acc;
      }, {} as Record<keyof typeof WCAG_LEVELS, boolean>);

      return { contrastRatio: ratio, results: checkResults };
    } catch (e) {
      return { contrastRatio: 1, results: {} as Record<keyof typeof WCAG_LEVELS, boolean> }; // Default on error
    }
  }, [textColor, bgColor]);

  const handleSwap = () => {
    triggerHapticFeedback();
    setTextColor(bgColor);
    setBgColor(textColor);
  };

  const generateRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

  const generateRandomPair = () => {
    triggerHapticFeedback();
    let newTextColor, newBgColor, ratio;
    do {
      newTextColor = generateRandomColor();
      newBgColor = generateRandomColor();
      const lum1 = getLuminance(newTextColor);
      const lum2 = getLuminance(newBgColor);
      ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    } while (ratio < 4.5); // Ensure at least AA compliance
    setTextColor(newTextColor);
    setBgColor(newBgColor);
  };

  const StatusPill = ({ passed }: { passed: boolean }) => (
    <span className={`px-3 py-1 text-sm font-bold rounded-full ${passed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
      {passed ? <CheckCircle className="inline-block w-4 h-4 mr-1" /> : <XCircle className="inline-block w-4 h-4 mr-1" />}
      {passed ? 'Pass' : 'Fail'}
    </span>
  );

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Color Contrast Checker 👁️‍🗨️</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Check color contrast against WCAG accessibility standards.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <label htmlFor="textColor" className="font-semibold text-lg w-32">Text Color</label>
                <input id="textColor" type="color" value={textColor} onFocus={triggerHapticFeedback} onChange={e => { setTextColor(e.target.value); triggerHapticFeedback(); }} className="w-16 h-12 p-1 border-none rounded-lg cursor-pointer" />
                <input type="text" value={textColor} onFocus={triggerHapticFeedback} onChange={e => { setTextColor(e.target.value); triggerHapticFeedback(); }} className="p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900" />
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="bgColor" className="font-semibold text-lg w-32">Background</label>
                <input id="bgColor" type="color" value={bgColor} onFocus={triggerHapticFeedback} onChange={e => { setBgColor(e.target.value); triggerHapticFeedback(); }} className="w-16 h-12 p-1 border-none rounded-lg cursor-pointer" />
                <input type="text" value={bgColor} onFocus={triggerHapticFeedback} onChange={e => { setBgColor(e.target.value); triggerHapticFeedback(); }} className="p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900" />
              </div>
              <div className="flex gap-4">
                <button onClick={handleSwap} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"><RefreshCw size={16} /> Swap</button>
                <button onClick={generateRandomPair} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"><Shuffle size={16} /> Random</button>
              </div>
            </div>

            <div className="rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-8 text-center" style={{ backgroundColor: bgColor, color: textColor }}>
                <h3 className="text-2xl font-bold">Preview Text</h3>
                <p className="mt-2 text-lg">Large text is easier to read.</p>
                <p className="mt-1">Normal text requires higher contrast.</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">Contrast Ratio</h2>
              <p className="text-6xl font-extrabold text-gray-900 dark:text-white">{contrastRatio.toFixed(2)}:1</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(WCAG_LEVELS).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{value.label}</span>
                  <StatusPill passed={!!results[key as keyof typeof WCAG_LEVELS]} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorContrastCheckerPage;
