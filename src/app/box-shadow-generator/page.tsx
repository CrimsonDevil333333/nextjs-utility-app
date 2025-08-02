'use client';

import { useState, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, Plus, Trash2 } from 'lucide-react';

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

    return (
        <button
            onClick={handleCopy}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
    );
}

const ControlSlider = ({ label, value, setValue, min, max, step = 1 }: { label: string, value: number, setValue: (val: number) => void, min: number, max: number, step?: number }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="font-medium text-sm">{label}</label>
            <span className="text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">{value}{label !== 'Opacity' && 'px'}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onFocus={triggerHapticFeedback}
            onChange={(e) => { setValue(parseFloat(e.target.value)); triggerHapticFeedback(); }}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
    </div>
);

// --- Main Component ---

export default function BoxShadowGeneratorPage() {
    const [shadows, setShadows] = useState([
        { hOffset: 10, vOffset: 10, blur: 5, spread: 0, color: '#000000', opacity: 0.5, inset: false }
    ]);

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const boxShadowValue = shadows.map(s => `${s.inset ? 'inset ' : ''}${s.hOffset}px ${s.vOffset}px ${s.blur}px ${s.spread}px ${hexToRgba(s.color, s.opacity)}`).join(', ');

    const handleShadowChange = (index: number, field: string, value: any) => {
        const newShadows = [...shadows];
        newShadows[index] = { ...newShadows[index], [field]: value };
        setShadows(newShadows);
    };

    const addShadow = () => {
        triggerHapticFeedback();
        setShadows([...shadows, { hOffset: 0, vOffset: 0, blur: 10, spread: 5, color: '#000000', opacity: 0.5, inset: false }]);
    };

    const removeShadow = (index: number) => {
        triggerHapticFeedback();
        setShadows(shadows.filter((_, i) => i !== index));
    };

    const handleReset = () => {
        triggerHapticFeedback();
        setShadows([{ hOffset: 10, vOffset: 10, blur: 5, spread: 0, color: '#000000', opacity: 0.5, inset: false }]);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">CSS Box Shadow Generator 🔳</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Create and customize complex box shadows with multiple layers.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
                        {shadows.map((shadow, index) => (
                            <div key={index} className="p-4 border rounded-lg dark:border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold">Layer {index + 1}</h3>
                                    {shadows.length > 1 && <button onClick={() => removeShadow(index)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><Trash2 size={16} /></button>}
                                </div>
                                <div className="space-y-4">
                                    <ControlSlider label="Horizontal Offset" value={shadow.hOffset} setValue={(val) => handleShadowChange(index, 'hOffset', val)} min={-100} max={100} />
                                    <ControlSlider label="Vertical Offset" value={shadow.vOffset} setValue={(val) => handleShadowChange(index, 'vOffset', val)} min={-100} max={100} />
                                    <ControlSlider label="Blur Radius" value={shadow.blur} setValue={(val) => handleShadowChange(index, 'blur', val)} min={0} max={100} />
                                    <ControlSlider label="Spread Radius" value={shadow.spread} setValue={(val) => handleShadowChange(index, 'spread', val)} min={-50} max={50} />
                                    <ControlSlider label="Opacity" value={shadow.opacity} setValue={(val) => handleShadowChange(index, 'opacity', val)} min={0} max={1} step={0.01} />
                                    <div className="flex items-center justify-between">
                                        <label className="font-medium text-sm">Color</label>
                                        <input type="color" value={shadow.color} onChange={(e) => handleShadowChange(index, 'color', e.target.value)} className="w-16 h-8 p-1 border border-gray-300 dark:border-gray-600 rounded" />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input id={`inset-${index}`} type="checkbox" checked={shadow.inset} onChange={(e) => handleShadowChange(index, 'inset', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                        <label htmlFor={`inset-${index}`} className="font-medium text-sm">Inset</label>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-4">
                            <button onClick={addShadow} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900"><Plus size={18} /> Add Layer</button>
                            <button onClick={handleReset} className="w-full py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Reset</button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-gray-200 dark:bg-gray-700 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center min-h-[400px]">
                        <div
                            className="w-48 h-48 sm:w-64 sm:h-64 bg-blue-500 rounded-lg transition-all duration-200"
                            style={{ boxShadow: boxShadowValue }}
                        ></div>
                        <div className="mt-8 w-full">
                            <div className="relative">
                                <textarea
                                    readOnly
                                    value={`box-shadow: ${boxShadowValue};`}
                                    className="w-full p-4 font-mono bg-gray-100 dark:bg-gray-800 rounded-lg text-sm sm:text-base break-all resize-none pr-16"
                                    rows={4}
                                />
                                <div className="absolute top-3 right-3">
                                    <CopyButton valueToCopy={`box-shadow: ${boxShadowValue};`} ariaLabel="Copy CSS" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
