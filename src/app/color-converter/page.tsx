'use client';

import { useState, useMemo, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, Shuffle, RefreshCw } from 'lucide-react';

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

  return (
    <button
      onClick={handleCopy}
      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
    </button>
  );
}

// --- Color Conversion Logic ---

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
};


export default function ColorConverterPage() {
  const [color, setColor] = useState({ r: 59, g: 130, b: 246 });

  const hex = useMemo(() => rgbToHex(color.r, color.g, color.b), [color]);
  const hsl = useMemo(() => rgbToHsl(color.r, color.g, color.b), [color]);

  const handleHexChange = (newHex: string) => {
    triggerHapticFeedback();
    const newRgb = hexToRgb(newHex);
    if (newRgb) {
      setColor(newRgb);
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: string) => {
    triggerHapticFeedback();
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
      setColor(prev => ({ ...prev, [channel]: numValue }));
    }
  };

  const handleHslChange = (channel: 'h' | 's' | 'l', value: string) => {
    triggerHapticFeedback();
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const newHsl = { ...hsl, [channel]: numValue };
      setColor(hslToRgb(newHsl.h, newHsl.s, newHsl.l));
    }
  };

  const generateRandomColor = () => {
    triggerHapticFeedback();
    setColor({
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    });
  };

  const resetColor = () => {
    triggerHapticFeedback();
    setColor({ r: 59, g: 130, b: 246 });
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Color Converter</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Convert colors between HEX, RGB, and HSL formats.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="w-full h-32 rounded-lg mb-6" style={{ backgroundColor: hex }}></div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">HEX</label>
              <div className="flex items-center gap-2">
                <input type="color" value={hex} onChange={e => handleHexChange(e.target.value)} className="w-12 h-10 p-1 border-none rounded-md cursor-pointer" />
                <input type="text" value={hex} onChange={e => handleHexChange(e.target.value)} className="flex-grow p-2.5 font-mono border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                <CopyButton valueToCopy={hex} ariaLabel="Copy HEX" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">RGB</label>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" value={color.r} onChange={e => handleRgbChange('r', e.target.value)} className="p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" placeholder="R" />
                <input type="number" value={color.g} onChange={e => handleRgbChange('g', e.target.value)} className="p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" placeholder="G" />
                <input type="number" value={color.b} onChange={e => handleRgbChange('b', e.target.value)} className="p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" placeholder="B" />
              </div>
              <div className="flex items-center justify-end mt-2"><CopyButton valueToCopy={`rgb(${color.r}, ${color.g}, ${color.b})`} ariaLabel="Copy RGB" /></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">HSL</label>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" value={hsl.h} onChange={e => handleHslChange('h', e.target.value)} className="p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" placeholder="H" />
                <input type="number" value={hsl.s} onChange={e => handleHslChange('s', e.target.value)} className="p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" placeholder="S" />
                <input type="number" value={hsl.l} onChange={e => handleHslChange('l', e.target.value)} className="p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" placeholder="L" />
              </div>
              <div className="flex items-center justify-end mt-2"><CopyButton valueToCopy={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} ariaLabel="Copy HSL" /></div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button onClick={generateRandomColor} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"><Shuffle size={16} /> Random</button>
            <button onClick={resetColor} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"><RefreshCw size={16} /> Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}
