'use client';

import { useState } from 'react';
import imageCompression from 'browser-image-compression';

export default function ImageCompressorPage() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      setOriginalImage(imageFile);
      setOriginalImageUrl(URL.createObjectURL(imageFile));
      setOriginalSize(imageFile.size / 1024); // Size in KB
      setCompressedImage(null);
      setCompressedSize(null);
    }
  };

  const compressImage = async () => {
    if (!originalImage) {
      alert('Please select an image first.');
      return;
    }

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
      alert('Image compression failed. Please check the console.');
    } finally {
      setIsCompressing(false);
    }
  };
  
  // New function to handle the download
  const handleDownload = () => {
    if (compressedImage && originalImage) {
      const link = document.createElement('a');
      link.href = compressedImage;
      // Set a filename for the download
      link.download = `compressed-${originalImage.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatSize = (sizeInKb: number) => {
    if (sizeInKb > 1024) {
      return `${(sizeInKb / 1024).toFixed(2)} MB`;
    }
    return `${sizeInKb.toFixed(2)} KB`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Client-Side Image Compressor
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Upload an image to compress it directly in your browser.
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {originalImage && (
          <button
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={compressImage}
            disabled={isCompressing}
          >
            {isCompressing ? 'Compressing...' : 'Compress Image'}
          </button>
        )}
      </div>

      {isCompressing && <p className="text-center mt-4">Working on it... ⚙️</p>}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {originalImageUrl && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Original Image</h2>
            {originalSize && <p className="mb-2 font-medium">Size: {formatSize(originalSize)}</p>}
            <img src={originalImageUrl} alt="Original" className="max-w-full h-auto rounded-lg shadow-lg" />
          </div>
        )}

        {compressedImage && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Compressed Image ✅</h2>
            {compressedSize && <p className="mb-2 font-medium">Size: {formatSize(compressedSize)}</p>}
            <img src={compressedImage} alt="Compressed" className="max-w-full h-auto rounded-lg shadow-lg" />
            
            {originalSize && compressedSize && (
              <p className="mt-4 text-xl font-bold text-center text-green-600">
                Reduced by {((originalSize - compressedSize) / originalSize * 100).toFixed(1)}%
              </p>
            )}
            
            {/* Download button added here */}
            <button
              onClick={handleDownload}
              className="mt-4 w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
            >
              Download Image 📥
            </button>
          </div>
        )}
      </div>
    </div>
  );
}