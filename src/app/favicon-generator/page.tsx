'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Download } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

export default function FaviconGeneratorPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sizes = [16, 32, 48, 64, 128, 180];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      triggerHapticFeedback();
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
      setImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const downloadFavicon = (size: number) => {
    triggerHapticFeedback();
    if (!imageSrc) return;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, size, size);
      const link = document.createElement('a');
      link.download = `favicon-${size}x${size}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = imageSrc;
  };

  const handleUploadClick = () => {
    triggerHapticFeedback();
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Favicon Generator ✨</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Create all favicon sizes from a single image.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          {!imageSrc ? (
            <div
              className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              onClick={handleUploadClick}
            >
              <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">Click or drag to upload an image</p>
              <button
                onClick={(e) => { e.stopPropagation(); handleUploadClick(); }}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                Select Image
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Your Favicons</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {sizes.map(size => (
                  <div key={size} className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center transition-shadow hover:shadow-md">
                    <img src={imageSrc} alt={`${size}x${size} preview`} style={{ width: size, height: size }} className="border dark:border-gray-600 mb-3 rounded-md" />
                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{size}x{size}</p>
                    <button
                      onClick={() => downloadFavicon(size)}
                      className="mt-3 text-xs inline-flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      <Download className="w-3 h-3 mr-1.5" />
                      Save
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={handleUploadClick}
                  className="px-5 py-2 text-sm bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Choose a Different Image
                </button>
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/svg+xml"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
