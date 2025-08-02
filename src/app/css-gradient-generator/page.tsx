'use client';

import { useState, useCallback, useMemo } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, RefreshCw, Shuffle } from 'lucide-react';

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

    const isValueEmpty = !valueToCopy;

    return (
        <button
            onClick={handleCopy}
            disabled={isValueEmpty}
            className={`p-2 rounded-md transition-all duration-200 ease-in-out ${isValueEmpty ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
    );
}

const CSSGradientGeneratorPage = () => {
    const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
    const [color1, setColor1] = useState('#ff0000');
    const [color2, setColor2] = useState('#0000ff');
    const [color3, setColor3] = useState('#00ff00');
    const [useColor3, setUseColor3] = useState(false);
    const [colorStop1, setColorStop1] = useState(0);
    const [colorStop2, setColorStop2] = useState(100);
    const [angle, setAngle] = useState(90);

    const gradient = useMemo(() => {
        const colors = [
            `${color1} ${colorStop1}%`,
            `${color2} ${colorStop2}%`,
            ...(useColor3 ? [`${color3}`] : [])
        ].join(', ');

        return gradientType === 'linear'
            ? `linear-gradient(${angle}deg, ${colors})`
            : `radial-gradient(circle, ${colors})`;
    }, [gradientType, color1, color2, color3, useColor3, colorStop1, colorStop2, angle]);

    const generateRandomGradient = () => {
        triggerHapticFeedback();
        const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        setColor1(randomColor());
        setColor2(randomColor());
        setColor3(randomColor());
        setAngle(Math.floor(Math.random() * 361));
    };

    const resetGradient = () => {
        triggerHapticFeedback();
        setColor1('#ff0000');
        setColor2('#0000ff');
        setColor3('#00ff00');
        setAngle(90);
        setUseColor3(false);
        setColorStop1(0);
        setColorStop2(100);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">CSS Gradient Generator</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Create and preview gradients in real-time.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-4">Controls</h2>
                            <div className="flex gap-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
                                <button onClick={() => { setGradientType('linear'); triggerHapticFeedback(); }} className={`w-full py-2 rounded-full font-semibold ${gradientType === 'linear' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Linear</button>
                                <button onClick={() => { setGradientType('radial'); triggerHapticFeedback(); }} className={`w-full py-2 rounded-full font-semibold ${gradientType === 'radial' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Radial</button>
                            </div>
                            <div className="flex items-center justify-around">
                                <div className="text-center">
                                    <label htmlFor="color1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color 1</label>
                                    <input id="color1" type="color" value={color1} onFocus={triggerHapticFeedback} onChange={(e) => { setColor1(e.target.value); triggerHapticFeedback(); }} className="w-20 h-20 p-1 border-none rounded-full cursor-pointer" />
                                </div>
                                <div className="text-center">
                                    <label htmlFor="color2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color 2</label>
                                    <input id="color2" type="color" value={color2} onFocus={triggerHapticFeedback} onChange={(e) => { setColor2(e.target.value); triggerHapticFeedback(); }} className="w-20 h-20 p-1 border-none rounded-full cursor-pointer" />
                                </div>
                                {useColor3 && (
                                    <div className="text-center">
                                        <label htmlFor="color3" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color 3</label>
                                        <input id="color3" type="color" value={color3} onFocus={triggerHapticFeedback} onChange={(e) => { setColor3(e.target.value); triggerHapticFeedback(); }} className="w-20 h-20 p-1 border-none rounded-full cursor-pointer" />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <input id="useColor3" type="checkbox" checked={useColor3} onChange={(e) => { setUseColor3(e.target.checked); triggerHapticFeedback(); }} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <label htmlFor="useColor3" className="font-medium">Add a third color</label>
                            </div>
                            <div>
                                <label htmlFor="angle" className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Angle: {angle}°</label>
                                <input id="angle" type="range" min="0" max="360" value={angle} onFocus={triggerHapticFeedback} onChange={(e) => { setAngle(Number(e.target.value)); triggerHapticFeedback(); }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="colorStop1" className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Color 1 Stop: {colorStop1}%</label>
                                    <input id="colorStop1" type="range" min="0" max="100" value={colorStop1} onFocus={triggerHapticFeedback} onChange={(e) => { setColorStop1(Number(e.target.value)); triggerHapticFeedback(); }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                </div>
                                <div>
                                    <label htmlFor="colorStop2" className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Color 2 Stop: {colorStop2}%</label>
                                    <input id="colorStop2" type="range" min="0" max="100" value={colorStop2} onFocus={triggerHapticFeedback} onChange={(e) => { setColorStop2(Number(e.target.value)); triggerHapticFeedback(); }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="css-output" className="block font-medium text-gray-700 dark:text-gray-300 mb-2">CSS Code</label>
                                <div className="flex items-center gap-2">
                                    <input id="css-output" type="text" value={`background: ${gradient};`} readOnly className="w-full p-3 border rounded-md font-mono bg-gray-100 dark:bg-gray-900/50 dark:border-gray-600" />
                                    <CopyButton valueToCopy={`background: ${gradient};`} ariaLabel="Copy CSS gradient code" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={generateRandomGradient} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"><Shuffle size={16} /> Random</button>
                                <button onClick={resetGradient} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"><RefreshCw size={16} /> Reset</button>
                            </div>
                        </div>
                        <div className="h-80 w-full rounded-lg shadow-lg border border-gray-200 dark:border-gray-700" style={{ background: gradient }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CSSGradientGeneratorPage;
