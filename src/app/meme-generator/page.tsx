'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Download, Text } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

const MemeGeneratorPage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState('Top Text');
  const [bottomText, setBottomText] = useState('Bottom Text');
  const [fontSize, setFontSize] = useState(48);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      triggerHapticFeedback();
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
          setImage(event.target?.result as string);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;

    if (canvas && ctx && img) {
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const iw = img.width * scale;
      const ih = img.height * scale;
      const ix = (canvas.width - iw) / 2;
      const iy = (canvas.height - ih) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, ix, iy, iw, ih);

      ctx.font = `bold ${fontSize}px Impact`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';

      ctx.fillText(topText, canvas.width / 2, iy + fontSize + 10);
      ctx.strokeText(topText, canvas.width / 2, iy + fontSize + 10);

      ctx.fillText(bottomText, canvas.width / 2, iy + ih - 10);
      ctx.strokeText(bottomText, canvas.width / 2, iy + ih - 10);
    }
  }, [image, topText, bottomText, fontSize]);

  const handleDownload = () => {
    triggerHapticFeedback();
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Meme Generator 😂</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Create your own memes instantly.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-4">Customize</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="imageUpload" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer">
                    <Upload size={18} /> Upload Image
                  </label>
                  <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
                <div>
                  <label htmlFor="topText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Top Text</label>
                  <input id="topText" type="text" value={topText} onFocus={triggerHapticFeedback} onChange={e => { setTopText(e.target.value); triggerHapticFeedback(); }} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                  <label htmlFor="bottomText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bottom Text</label>
                  <input id="bottomText" type="text" value={bottomText} onFocus={triggerHapticFeedback} onChange={e => { setBottomText(e.target.value); triggerHapticFeedback(); }} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                  <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Font Size: {fontSize}px</label>
                  <input id="fontSize" type="range" min="16" max="128" value={fontSize} onFocus={triggerHapticFeedback} onChange={e => { setFontSize(parseInt(e.target.value)); triggerHapticFeedback(); }} className="mt-1 w-full" />
                </div>
                <button onClick={handleDownload} disabled={!image} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                  <Download size={18} /> Download Meme
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-gray-200 dark:bg-gray-900 p-4 rounded-xl flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGeneratorPage;
