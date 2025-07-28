'use client';

import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Correct named import

export default function QRCodeGeneratorPage() {
  const [text, setText] = useState<string>('https://google.com');
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('L');

  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
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
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-gray-100">
        QR Code Generator
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        Create and customize your QR code, then download it as a PNG.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Side: Controls */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Customize</h2>
          <label className="block mb-4">
            <span className="font-medium text-gray-700 dark:text-gray-300">Text or URL</span>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to generate QR code"
              className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <label>
              <span className="font-medium text-gray-700 dark:text-gray-300">Color</span>
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 mt-1 rounded-md" />
            </label>
            <label>
              <span className="font-medium text-gray-700 dark:text-gray-300">Background</span>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 mt-1 rounded-md" />
            </label>
          </div>
          <label>
            <span className="font-medium text-gray-700 dark:text-gray-300">Error Correction</span>
            <select value={level} onChange={(e) => setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
              <option value="L">Low (L)</option>
              <option value="M">Medium (M)</option>
              <option value="Q">Quartile (Q)</option>
              <option value="H">High (H)</option>
            </select>
          </label>
        </div>

        {/* Right Side: QR Code Preview */}
        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {text ? (
            <div className="flex flex-col items-center gap-6">
              <div ref={qrRef} className="p-4 bg-white rounded-lg">
                {/* Use the new component name here */}
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
  );
}