'use client';

import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { triggerHapticFeedback } from '@/utils/haptics';

export default function QRCodeGeneratorPage() {
  const [text, setText] = useState<string>('https://google.com');
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('L');

  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    triggerHapticFeedback();
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector<HTMLCanvasElement>('canvas');
      if (canvas) {
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'qrcode.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        console.error("Could not find canvas element to download.");
      }
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">QR Code Generator</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Create and customize your QR code, then download it as a PNG.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Customize</h2>
              <div>
                <label htmlFor="qr-text" className="font-medium text-gray-700 dark:text-gray-300">Text or URL</label>
                <input
                  id="qr-text"
                  type="text"
                  value={text}
                  onFocus={triggerHapticFeedback}
                  onChange={(e) => { setText(e.target.value); triggerHapticFeedback(); }}
                  placeholder="Enter text to generate QR code"
                  className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fg-color" className="font-medium text-gray-700 dark:text-gray-300">Color</label>
                  <input id="fg-color" type="color" value={fgColor} onFocus={triggerHapticFeedback} onChange={(e) => { setFgColor(e.target.value); triggerHapticFeedback(); }} className="w-full h-12 mt-1 rounded-md p-1 border-none cursor-pointer" />
                </div>
                <div>
                  <label htmlFor="bg-color" className="font-medium text-gray-700 dark:text-gray-300">Background</label>
                  <input id="bg-color" type="color" value={bgColor} onFocus={triggerHapticFeedback} onChange={(e) => { setBgColor(e.target.value); triggerHapticFeedback(); }} className="w-full h-12 mt-1 rounded-md p-1 border-none cursor-pointer" />
                </div>
              </div>
              <div>
                <label htmlFor="error-level" className="font-medium text-gray-700 dark:text-gray-300">Error Correction</label>
                <select id="error-level" value={level} onFocus={triggerHapticFeedback} onChange={(e) => { setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H'); triggerHapticFeedback(); }} className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                  <option value="L">Low (L)</option>
                  <option value="M">Medium (M)</option>
                  <option value="Q">Quartile (Q)</option>
                  <option value="H">High (H)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
              {text ? (
                <div className="flex flex-col items-center gap-6">
                  <div ref={qrRef} className="p-4 bg-white rounded-lg shadow-inner">
                    <QRCodeCanvas
                      value={text}
                      size={256}
                      bgColor={bgColor}
                      fgColor={fgColor}
                      level={level}
                      includeMargin={true}
                    />
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-lg"
                  >
                    Download QR Code 📥
                  </button>
                </div>
              ) : (
                <div className="h-[328px] flex items-center justify-center text-gray-500">
                  Enter text to see your QR code.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
