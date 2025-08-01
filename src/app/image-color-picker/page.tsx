'use client';

import { useState, useRef, MouseEvent, useCallback, TouchEvent } from 'react';
import { Upload, Copy, Pipette } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Helper Functions for Color Conversion ---
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const rgbToHsl = (r: number, g: number, b: number): string => {
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
  return `hsl(${(h * 360).toFixed(0)}, ${(s * 100).toFixed(0)}%, ${(l * 100).toFixed(0)}%)`;
};


export default function ImageColorPickerPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [pickedColor, setPickedColor] = useState<{ r: number, g: number, b: number } | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [loupePosition, setLoupePosition] = useState({ x: 0, y: 0, visible: false });
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      triggerHapticFeedback();
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      const url = URL.createObjectURL(e.target.files[0]);
      setImageSrc(url);
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const aspectRatio = img.width / img.height;
          const maxWidth = 800; // Max width for the canvas
          canvas.width = Math.min(img.width, maxWidth);
          canvas.height = canvas.width / aspectRatio;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      };
      img.src = url;
      setPickedColor(null);
      setPalette([]);
    }
  };

  const handleInteraction = (clientX: number, clientY: number, isFinalPick: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    // Calculate coordinates relative to the canvas's display size
    const displayX = clientX - rect.left;
    const displayY = clientY - rect.top;

    // Calculate the scaling factor between display size and canvas resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Scale the coordinates to match the canvas's internal resolution
    const canvasX = displayX * scaleX;
    const canvasY = displayY * scaleY;

    // Ensure coordinates are within the canvas bounds
    if (canvasX < 0 || canvasX >= canvas.width || canvasY < 0 || canvasY >= canvas.height) {
      setLoupePosition(p => ({ ...p, visible: false }));
      return;
    }

    // Update the loupe position based on the display coordinates
    setLoupePosition({ x: displayX, y: displayY, visible: true });

    // Get the color from the scaled canvas coordinates
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const pixel = ctx?.getImageData(canvasX, canvasY, 1, 1).data;

    if (pixel) {
      const color = { r: pixel[0], g: pixel[1], b: pixel[2] };
      setPickedColor(color);
      if (isFinalPick) {
        triggerHapticFeedback();
        const hexColor = rgbToHex(color.r, color.g, color.b);
        setPalette(prev => [hexColor, ...prev.filter(c => c !== hexColor)].slice(0, 8));
      }
    }
  };

  // Mouse Events
  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => handleInteraction(e.clientX, e.clientY, false);
  const handleClick = (e: MouseEvent<HTMLCanvasElement>) => handleInteraction(e.clientX, e.clientY, true);

  // Touch Events
  const handleTouchStart = (e: TouchEvent<HTMLCanvasElement>) => handleInteraction(e.touches[0].clientX, e.touches[0].clientY, false);
  const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => handleInteraction(e.touches[0].clientX, e.touches[0].clientY, false);
  const handleTouchEnd = (e: TouchEvent<HTMLCanvasElement>) => {
    if (e.changedTouches.length > 0) {
      handleInteraction(e.changedTouches[0].clientX, e.changedTouches[0].clientY, true);
    }
    setLoupePosition(p => ({ ...p, visible: false }));
  };

  const handleCopy = (text: string) => {
    triggerHapticFeedback();
    navigator.clipboard.writeText(text);
    setCopyStatus(text);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const colorFormats = pickedColor ? {
    rgb: `rgb(${pickedColor.r}, ${pickedColor.g}, ${pickedColor.b})`,
    hex: rgbToHex(pickedColor.r, pickedColor.g, pickedColor.b),
    hsl: rgbToHsl(pickedColor.r, pickedColor.g, pickedColor.b),
  } : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Image Color Picker 📍</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Upload an image and pick any color with a magnifying loupe.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6">
            <button onClick={() => { fileInputRef.current?.click(); triggerHapticFeedback(); }} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              {imageSrc ? 'Choose a Different Image' : 'Upload Image'}
            </button>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          {!imageSrc ? (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <p className="text-gray-500">Image preview will appear here</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 relative">
                <canvas
                  ref={canvasRef}
                  onMouseMove={handleMouseMove}
                  onClick={handleClick}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseLeave={() => setLoupePosition(p => ({ ...p, visible: false }))}
                  className="cursor-crosshair w-full h-auto border rounded-lg shadow-md"
                />
                {loupePosition.visible && (
                  <div
                    className="absolute pointer-events-none border-4 border-white rounded-full shadow-2xl"
                    style={{
                      left: `${loupePosition.x - 50}px`,
                      top: `${loupePosition.y - 50}px`,
                      width: '100px',
                      height: '100px',
                      backgroundImage: `url(${imageSrc})`,
                      backgroundPosition: `${-loupePosition.x * (canvasRef.current!.width / canvasRef.current!.getBoundingClientRect().width) * 3 + 50}px ${-loupePosition.y * (canvasRef.current!.height / canvasRef.current!.getBoundingClientRect().height) * 3 + 50}px`,
                      backgroundSize: `${canvasRef.current!.width * 3}px ${canvasRef.current!.height * 3}px`,
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <div className="w-full h-full relative">
                      <div className="absolute top-1/2 left-0 w-full h-px bg-black opacity-50"></div>
                      <div className="absolute left-1/2 top-0 w-px h-full bg-black opacity-50"></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2 flex items-center"><Pipette className="w-5 h-5 mr-2" />Picked Color</h2>
                  {colorFormats ? (
                    <div className="space-y-2">
                      {Object.entries(colorFormats).map(([name, value]) => (
                        <div key={name} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                          <span className="font-bold text-sm uppercase">{name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{value}</span>
                            <button onClick={() => handleCopy(value)} title={`Copy ${name}`}>
                              {copyStatus === value ? <span className="text-xs text-green-500">Copied!</span> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-gray-500">Hover and click on the image to pick a color.</p>}
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Palette</h2>
                  {palette.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {palette.map((color, i) => (
                        <div key={i} className="relative group">
                          <div className="w-full pt-[100%] rounded-md border" style={{ backgroundColor: color }} />
                          <button onClick={() => handleCopy(color)} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                            <Copy className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-gray-500">Your recently picked colors will appear here.</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
