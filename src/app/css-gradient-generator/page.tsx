'use client';
import { useState } from 'react';

const CSSGradientGeneratorPage = () => {
    const [color1, setColor1] = useState('#ff0000');
    const [color2, setColor2] = useState('#0000ff');
    const [angle, setAngle] = useState(90);

    const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-6">CSS Gradient Generator</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-16 h-16" />
                        <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-16 h-16" />
                    </div>
                    <div>
                        <label className="block font-medium">Angle: {angle}°</label>
                        <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full" />
                    </div>
                    <input type="text" value={gradient} readOnly className="w-full p-2 border rounded-md font-mono bg-gray-100 dark:bg-gray-800 dark:border-gray-600" />
                </div>
                <div className="h-64 rounded-lg" style={{ background: gradient }}></div>
            </div>
        </div>
    );
};

export default CSSGradientGeneratorPage;