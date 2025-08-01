'use client';

import { useState } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

const BoxShadowGeneratorPage = () => {
    const [hOffset, setHOffset] = useState(10);
    const [vOffset, setVOffset] = useState(10);
    const [blur, setBlur] = useState(5);
    const [spread, setSpread] = useState(0);
    const [color, setColor] = useState('#000000');
    const [opacity, setOpacity] = useState(0.5);
    const [inset, setInset] = useState(false);

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const boxShadowValue = `${inset ? 'inset ' : ''}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">CSS Box Shadow Generator 🔳</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Controls</h2>
                    <div className="space-y-4">
                        <ControlSlider label="Horizontal Offset" value={hOffset} setValue={setHOffset} min={-100} max={100} />
                        <ControlSlider label="Vertical Offset" value={vOffset} setValue={setVOffset} min={-100} max={100} />
                        <ControlSlider label="Blur Radius" value={blur} setValue={setBlur} min={0} max={100} />
                        <ControlSlider label="Spread Radius" value={spread} setValue={setSpread} min={-50} max={50} />
                        <ControlSlider label="Opacity" value={opacity} setValue={setOpacity} min={0} max={1} step={0.01} />
                        <div className="flex items-center justify-between">
                            <label className="font-medium">Color</label>
                            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-16 h-8 p-1 border border-gray-300 dark:border-gray-600 rounded" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input id="inset" type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="inset" className="font-medium">Inset</label>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-gray-200 dark:bg-gray-700 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center min-h-[400px]">
                    <div
                        className="w-48 h-48 sm:w-64 sm:h-64 bg-blue-500 rounded-lg transition-all duration-200"
                        style={{ boxShadow: boxShadowValue }}
                    ></div>
                    <div className="mt-8 w-full">
                        <p className="font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm sm:text-base break-all">
                            box-shadow: {boxShadowValue};
                        </p>
                        <button onClick={() => { navigator.clipboard.writeText(`box-shadow: ${boxShadowValue};`); triggerHapticFeedback(); }} className="mt-4 w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                            Copy to Clipboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// A helper component to reduce repetition
const ControlSlider = ({ label, value, setValue, min, max, step = 1 }: { label: string, value: number, setValue: (val: number) => void, min: number, max: number, step?: number }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="font-medium">{label}</label>
            <span className="text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">{value}px</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
    </div>
);


export default BoxShadowGeneratorPage;