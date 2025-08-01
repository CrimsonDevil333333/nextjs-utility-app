'use client';

import { useState, useMemo, useEffect } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

// Constants for conversion
const KG_TO_LBS = 2.20462;
const CM_TO_INCHES = 0.393701;
const BMI_RANGE = { min: 15, max: 40 };

const BmiCalculatorPage = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [values, setValues] = useState({
    weight: '70',
    height: '175',
    heightInches: '0',
  });

  // Effect to handle automatic unit conversion when the system changes
  useEffect(() => {
    const { weight, height } = values;
    const numWeight = parseFloat(weight);
    const numHeight = parseFloat(height);

    if (unit === 'imperial') {
      // Convert from Metric (kg/cm) to Imperial (lbs/ft+in)
      if (numWeight) {
        setValues(prev => ({ ...prev, weight: (numWeight * KG_TO_LBS).toFixed(1) }));
      }
      if (numHeight) {
        const totalInches = numHeight * CM_TO_INCHES;
        const feet = Math.floor(totalInches / 12);
        const inches = (totalInches % 12).toFixed(1);
        setValues(prev => ({ ...prev, height: String(feet), heightInches: inches }));
      }
    } else {
      // Convert from Imperial (lbs/ft+in) to Metric (kg/cm)
      if (numWeight) {
        setValues(prev => ({ ...prev, weight: (numWeight / KG_TO_LBS).toFixed(1) }));
      }
      if (numHeight) {
        const numHeightInches = parseFloat(values.heightInches) || 0;
        const totalInches = numHeight * 12 + numHeightInches;
        setValues(prev => ({ ...prev, height: (totalInches / CM_TO_INCHES).toFixed(1), heightInches: '0' }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const { bmi, category, color, gaugePercentage } = useMemo(() => {
    const w = parseFloat(values.weight);
    const h = parseFloat(values.height);
    let bmiValue;

    if (w > 0 && h > 0) {
      if (unit === 'metric') {
        bmiValue = w / (h / 100) ** 2;
      } else {
        const hInches = parseFloat(values.heightInches) || 0;
        const totalHeightInInches = h * 12 + hInches;
        bmiValue = totalHeightInInches > 0 ? 703 * (w / totalHeightInInches ** 2) : 0;
      }

      const percent = ((bmiValue - BMI_RANGE.min) / (BMI_RANGE.max - BMI_RANGE.min)) * 100;
      const gaugePercentage = Math.max(0, Math.min(100, percent));

      if (bmiValue < 18.5) return { bmi: bmiValue.toFixed(1), category: 'Underweight', color: 'text-blue-500', gaugePercentage };
      if (bmiValue < 25) return { bmi: bmiValue.toFixed(1), category: 'Normal', color: 'text-green-500', gaugePercentage };
      if (bmiValue < 30) return { bmi: bmiValue.toFixed(1), category: 'Overweight', color: 'text-yellow-500', gaugePercentage };
      return { bmi: bmiValue.toFixed(1), category: 'Obesity', color: 'text-red-500', gaugePercentage };
    }
    return { bmi: '0.0', category: 'N/A', color: 'text-gray-500', gaugePercentage: 0 };
  }, [values, unit]);

  const handleValueChange = (field: keyof typeof values, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-8 mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">BMI Calculator 💪</h1>

      <div className="flex justify-center mb-6 bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
        <button onClick={() => { setUnit('metric'); triggerHapticFeedback(); }} className={`w-1/2 py-2 rounded-full transition-all ${unit === 'metric' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>Metric</button>
        <button onClick={() => { setUnit('imperial'); triggerHapticFeedback(); }} className={`w-1/2 py-2 rounded-full transition-all ${unit === 'imperial' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>Imperial</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
          <input type="number" value={values.weight} onChange={(e) => handleValueChange('weight', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Height ({unit === 'metric' ? 'cm' : 'ft & in'})</label>
          {unit === 'metric' ? (
            <input type="number" value={values.height} onChange={(e) => handleValueChange('height', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          ) : (
            <div className="flex space-x-2">
              <input type="number" value={values.height} onChange={(e) => handleValueChange('height', e.target.value)} className="mt-1 block w-1/2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" placeholder="ft" />
              <input type="number" value={values.heightInches} onChange={(e) => handleValueChange('heightInches', e.target.value)} className="mt-1 block w-1/2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" placeholder="in" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <div className="relative w-full h-3 bg-gradient-to-r from-blue-400 via-green-400 to-red-500 rounded-full mb-4">
          <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-lg border-2 border-gray-300 dark:border-gray-500"
            style={{ left: `calc(${gaugePercentage}% - 10px)`, transition: 'left 0.4s ease-in-out' }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Underweight</span>
          <span>Normal</span>
          <span>Overweight</span>
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-300 mt-6">Your BMI is</p>
        <p className={`text-6xl font-extrabold my-1 ${color}`}>{bmi}</p>
        <p className={`text-xl font-semibold ${color}`}>{category}</p>
      </div>
    </div>
  );
};

export default BmiCalculatorPage;