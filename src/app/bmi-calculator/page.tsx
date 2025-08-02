'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { RefreshCw } from 'lucide-react';

// --- Constants and Types ---
const KG_TO_LBS = 2.20462;
const CM_TO_INCHES = 0.393701;
const BMI_RANGE = { min: 15, max: 40 };

const BmiCalculatorPage = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [values, setValues] = useState({
    weight: '70',
    height: '175',
    heightInches: '0',
    age: '30',
    gender: 'male',
  });

  // Effect to handle automatic unit conversion
  useEffect(() => {
    const { weight, height } = values;
    const numWeight = parseFloat(weight);
    const numHeight = parseFloat(height);

    if (!isNaN(numWeight) && !isNaN(numHeight)) {
      if (unit === 'imperial') {
        setValues(prev => ({
          ...prev,
          weight: (numWeight * KG_TO_LBS).toFixed(1),
          height: Math.floor((numHeight * CM_TO_INCHES) / 12).toString(),
          heightInches: ((numHeight * CM_TO_INCHES) % 12).toFixed(1),
        }));
      } else {
        const numHeightInches = parseFloat(values.heightInches) || 0;
        const totalInches = numHeight * 12 + numHeightInches;
        setValues(prev => ({
          ...prev,
          weight: (numWeight / KG_TO_LBS).toFixed(1),
          height: (totalInches / CM_TO_INCHES).toFixed(1),
          heightInches: '0',
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const { bmi, category, color, gaugePercentage, healthyWeightRange } = useMemo(() => {
    const w = parseFloat(values.weight);
    const h = parseFloat(values.height);
    let bmiValue = 0;
    let heightInMeters = 0;

    if (w > 0 && h > 0) {
      if (unit === 'metric') {
        heightInMeters = h / 100;
        bmiValue = w / (heightInMeters ** 2);
      } else {
        const hInches = parseFloat(values.heightInches) || 0;
        const totalHeightInInches = h * 12 + hInches;
        heightInMeters = totalHeightInInches * 0.0254;
        if (totalHeightInInches > 0) {
          bmiValue = 703 * (w / totalHeightInInches ** 2);
        }
      }
    }

    const percent = ((bmiValue - BMI_RANGE.min) / (BMI_RANGE.max - BMI_RANGE.min)) * 100;
    const gaugePercentage = Math.max(0, Math.min(100, percent));

    const minHealthyWeight = 18.5 * (heightInMeters ** 2);
    const maxHealthyWeight = 24.9 * (heightInMeters ** 2);

    const healthyWeightRange = unit === 'metric'
      ? `${minHealthyWeight.toFixed(1)}kg - ${maxHealthyWeight.toFixed(1)}kg`
      : `${(minHealthyWeight * KG_TO_LBS).toFixed(1)}lbs - ${(maxHealthyWeight * KG_TO_LBS).toFixed(1)}lbs`;

    if (bmiValue < 18.5) return { bmi: bmiValue.toFixed(1), category: 'Underweight', color: 'text-blue-500', gaugePercentage, healthyWeightRange };
    if (bmiValue < 25) return { bmi: bmiValue.toFixed(1), category: 'Normal', color: 'text-green-500', gaugePercentage, healthyWeightRange };
    if (bmiValue < 30) return { bmi: bmiValue.toFixed(1), category: 'Overweight', color: 'text-yellow-500', gaugePercentage, healthyWeightRange };
    return { bmi: bmiValue.toFixed(1), category: 'Obesity', color: 'text-red-500', gaugePercentage, healthyWeightRange };
  }, [values, unit]);

  const handleValueChange = (field: keyof typeof values, value: string) => {
    triggerHapticFeedback();
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = useCallback(() => {
    triggerHapticFeedback();
    setValues({
      weight: unit === 'metric' ? '70' : '154',
      height: unit === 'metric' ? '175' : '5',
      heightInches: unit === 'metric' ? '0' : '9',
      age: '30',
      gender: 'male',
    });
  }, [unit]);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">BMI Calculator 💪</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Calculate your Body Mass Index.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex justify-center mb-6 bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
            <button onClick={() => { setUnit('metric'); triggerHapticFeedback(); }} className={`w-1/2 py-2 rounded-full transition-all ${unit === 'metric' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>Metric</button>
            <button onClick={() => { setUnit('imperial'); triggerHapticFeedback(); }} className={`w-1/2 py-2 rounded-full transition-all ${unit === 'imperial' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>Imperial</button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                <input type="number" value={values.age} onChange={(e) => handleValueChange('age', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                <select value={values.gender} onChange={(e) => handleValueChange('gender', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
              <input type="number" value={values.weight} onChange={(e) => handleValueChange('weight', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Height ({unit === 'metric' ? 'cm' : 'ft & in'})</label>
              {unit === 'metric' ? (
                <input type="number" value={values.height} onChange={(e) => handleValueChange('height', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Healthy weight range: <strong>{healthyWeightRange}</strong></p>
          </div>
          <button onClick={handleReset} className="w-full mt-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center justify-center gap-2">
            <RefreshCw size={18} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default BmiCalculatorPage;
