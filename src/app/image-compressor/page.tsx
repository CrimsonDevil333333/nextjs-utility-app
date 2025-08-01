'use client';

import { useState, useRef, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, Download, RefreshCw } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

export default function ImageCompressorPage() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      triggerHapticFeedback();
      const imageFile = e.target.files[0];
      setOriginalImage(imageFile);
      setOriginalImageUrl(URL.createObjectURL(imageFile));
      setOriginalSize(imageFile.size / 1024); // Size in KB
      setCompressedImage(null);
      setCompressedSize(null);
    }
  };

  const compressImage = async () => {
    if (!originalImage) return;

    triggerHapticFeedback();
    setIsCompressing(true);
    setCompressedImage(null);
    setCompressedSize(null);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(originalImage, options);
      const compressedUrl = URL.createObjectURL(compressedFile);
      setCompressedImage(compressedUrl);
      setCompressedSize(compressedFile.size / 1024);
    } catch (error) {
      console.error('Image compression failed:', error);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    triggerHapticFeedback();
    if (compressedImage && originalImage) {
      const link = document.createElement('a');
      link.href = compressedImage;
      link.download = `compressed-${originalImage.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    triggerHapticFeedback();
    setOriginalImage(null);
    setOriginalImageUrl(null);
    setOriginalSize(null);
    setCompressedImage(null);
    setCompressedSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatSize = (sizeInKb: number) => {
    if (sizeInKb > 1024) {
      return `${(sizeInKb / 1024).toFixed(2)} MB`;
    }
    return `${sizeInKb.toFixed(2)} KB`;
  };

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Image Compressor</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Compress images in your browser without uploading to a server.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6">
            <button onClick={() => { fileInputRef.current?.click(); triggerHapticFeedback(); }} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              {originalImage ? 'Choose a Different Image' : 'Upload Image'}
            </button>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          {originalImage && (
            <div className="flex justify-center gap-4 mb-6">
              <button
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={compressImage}
                disabled={isCompressing}
              >
                {isCompressing ? <RefreshCw className="animate-spin" /> : null}
                {isCompressing ? 'Compressing...' : 'Compress Image'}
              </button>
              <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-lg">Reset</button>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {!originalImageUrl ? (
              <div className="md:col-span-2 flex items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p className="text-gray-500">Image previews will appear here</p>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Original Image</h2>
                  {originalSize && <p className="mb-2 font-medium">Size: {formatSize(originalSize)}</p>}
                  <img src={originalImageUrl} alt="Original" className="max-w-full h-auto rounded-lg shadow-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Compressed Image</h2>
                  {isCompressing ? (
                    <div className="flex items-center justify-center h-full"><p>Working on it... ⚙️</p></div>
                  ) : compressedImage ? (
                    <>
                      {compressedSize && <p className="mb-2 font-medium">Size: {formatSize(compressedSize)}</p>}
                      <img src={compressedImage} alt="Compressed" className="max-w-full h-auto rounded-lg shadow-lg" />
                      {originalSize && compressedSize && (
                        <p className="mt-4 text-xl font-bold text-center text-green-600">
                          Reduced by {((originalSize - compressedSize) / originalSize * 100).toFixed(1)}%
                        </p>
                      )}
                      <button
                        onClick={handleDownload}
                        className="mt-4 w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg flex items-center justify-center gap-2"
                      >
                        <Download /> Download Image
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">Click "Compress Image" to see the result.</div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
