'use client';

import { useState, useMemo, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics'; // Import useCallback

// Helper to compute hash
async function computeHash(text: string, algorithm: 'SHA-256' | 'SHA-512'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  try {
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    console.error(`Error computing ${algorithm} hash:`, e);
    return `Error computing ${algorithm} hash.`;
  }
}

// Re-defining HashOutput for this context to include shared copy button logic
// This component can be extracted to a shared file if used across multiple pages
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
        // Optionally, provide user feedback for failed copy
      }
    }
  }, [valueToCopy]);

  const isValueEmpty = !valueToCopy || valueToCopy.startsWith('Invalid') || valueToCopy.startsWith('Error');

  return (
    <button
      onClick={handleCopy}
      disabled={isValueEmpty}
      className={`
                px-3 py-1.5 text-sm font-medium rounded-md
                flex items-center space-x-1
                transition-all duration-200 ease-in-out
                ${isValueEmpty
          ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
        }
            `}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}


// Conversion logic (same as before)
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0
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
}

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#3b82f6'); // Default to a blue
  const [hexInputError, setHexInputError] = useState(false); // New state for hex input validation

  const { rgb, hsl } = useMemo(() => {
    // Clear any previous error when hex changes
    setHexInputError(false);

    const rgbVal = hexToRgb(hex);
    if (!rgbVal) {
      setHexInputError(true); // Set error if hex is invalid
      return { rgb: null, hsl: null };
    }
    const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
    return { rgb: rgbVal, hsl: hslVal };
  }, [hex]);

  const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'Invalid HEX';
  const hslString = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : 'Invalid HEX';
  const hexDisplay = hexInputError ? 'Invalid HEX' : hex.toUpperCase(); // Display actual hex or error

  return (
    <div className="max-w-md mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Color Converter</h1>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 space-y-6"> {/* Added panel styling */}

        {/* Color Preview */}
        <div
          className="w-full h-32 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner"
          style={{ backgroundColor: hexInputError ? '#ef4444' : hex }} // Show red for error, else actual color
        ></div>

        {/* Hex Input Group */}
        <div>
          <label htmlFor="hex-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">HEX Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={hex} onChange={e => { setHex(e.target.value); triggerHapticFeedback(); }} className="w-16 h-10 p-0 border-none rounded-md cursor-pointer overflow-hidden" />
            <input
              id="hex-input"
              type="text"
              value={hex}
              onChange={e => setHex(e.target.value)}
              onFocus={triggerHapticFeedback}
              placeholder="#RRGGBB"
              className={`
                w-full p-2.5 font-mono border rounded-md
                bg-gray-50 dark:bg-gray-700 dark:border-gray-600
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                dark:focus:ring-blue-400 dark:focus:border-blue-400
                transition-all duration-200 ease-in-out
                ${hexInputError ? 'border-red-500 ring-red-500' : ''} // Error border
              `}
            />
            <CopyButton valueToCopy={hexDisplay} ariaLabel="Copy HEX color" />
          </div>
          {hexInputError && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-2">
              Invalid HEX format. e.g., #RRGGBB
            </p>
          )}
        </div>

        {/* Converted Values Panel */}
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 space-y-4"> {/* Increased space-y */}

          {/* RGB Output */}
          <div className="flex items-center justify-between">
            <p className="text-gray-900 dark:text-gray-100">
              <strong className="font-semibold mr-2">RGB:</strong>
              <span className="font-mono text-sm">{rgbString}</span>
            </p>
            <CopyButton valueToCopy={rgbString} ariaLabel="Copy RGB color" />
          </div>

          {/* HSL Output */}
          <div className="flex items-center justify-between">
            <p className="text-gray-900 dark:text-gray-100">
              <strong className="font-semibold mr-2">HSL:</strong>
              <span className="font-mono text-sm">{hslString}</span>
            </p>
            <CopyButton valueToCopy={hslString} ariaLabel="Copy HSL color" />
          </div>
        </div>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Uses standard color conversion algorithms.
        </p>
      </div>
    </div>
  );
}