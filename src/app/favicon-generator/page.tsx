'use client';
import { useState, useRef } from 'react';
import { Upload, Download } from 'lucide-react';

export default function FaviconGeneratorPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  // Create a ref to access the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sizes = [16, 32, 48, 64, 128, 180]; // Added more common sizes

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Revoke the previous object URL to prevent memory leaks
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
      setImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const downloadFavicon = (size: number) => {
    if (!imageSrc) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Set crossOrigin to "anonymous" if loading images from a URL
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

  // Function to trigger the hidden file input
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">Favicon Generator ✨</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Create all favicon sizes from a single image.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {!imageSrc ? (
          // View when no image is uploaded
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-gray-500 mb-4">Upload an image to get started</p>
            <button
              onClick={handleUploadClick}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Image
            </button>
          </div>
        ) : (
          // View after an image is uploaded
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Your Favicons</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {sizes.map(size => (
                <div key={size} className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                  <img src={imageSrc} alt={`${size}x${size} preview`} style={{ width: size, height: size }} className="border dark:border-gray-500 mb-3" />
                  <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{size}x{size}</p>
                  <button 
                    onClick={() => downloadFavicon(size)} 
                    className="mt-2 text-xs inline-flex items-center px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Save
                  </button>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button
                onClick={handleUploadClick}
                className="px-5 py-2 text-sm bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Choose a Different Image
              </button>
            </div>
          </div>
        )}
        
        {/* Hidden file input, controlled by our button */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/svg+xml"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

// export default FaviconGeneratorPage; // Removed duplicate default export