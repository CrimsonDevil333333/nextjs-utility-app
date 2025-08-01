'use client';

import { useState } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

/**
 * A component that renders a specific face of a die based on the number.
 * @param {number} number - The number to display on the die face (1-6).
 */
const DiceFace = ({ number }: { number: number }) => {
  const dotPatterns: { [key: number]: string[] } = {
    1: ['justify-center items-center'],
    2: ['justify-between'],
    3: ['justify-between items-center', 'justify-center items-center'],
    4: ['justify-between', 'justify-between'],
    5: ['justify-between', 'justify-center items-center', 'justify-between'],
    6: ['justify-between', 'justify-between', 'justify-between'],
  };

  const getDots = (num: number) => {
    switch (num) {
      case 1: return [<div key="1-1" className="dot" />];
      case 2: return [<div key="2-1" className="dot" />, <div key="2-2" className="dot self-end" />];
      case 3: return [<div key="3-1" className="dot" />, <div key="3-2" className="dot" />, <div key="3-3" className="dot self-end" />];
      case 4: return [
        <div key="4-1" className="flex flex-col justify-between h-full"><div className="dot" /><div className="dot" /></div>,
        <div key="4-2" className="flex flex-col justify-between h-full"><div className="dot" /><div className="dot" /></div>
      ];
      case 5: return [
        <div key="5-1" className="flex flex-col justify-between h-full"><div className="dot" /><div className="dot" /></div>,
        <div key="5-2" className="flex justify-center items-center h-full"><div className="dot" /></div>,
        <div key="5-3" className="flex flex-col justify-between h-full"><div className="dot" /><div className="dot" /></div>
      ];
      case 6: return [
        <div key="6-1" className="flex flex-col justify-between h-full"><div className="dot" /><div className="dot" /><div className="dot" /></div>,
        <div key="6-2" className="flex flex-col justify-between h-full"><div className="dot" /><div className="dot" /><div className="dot" /></div>
      ];
      default: return [];
    }
  };

  return (
    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl shadow-lg p-4 flex justify-center items-center">
      <div className={`w-full h-full flex ${number === 4 || number === 5 || number === 6 ? 'justify-between' : 'justify-center items-center'}`}>
        {getDots(number)}
      </div>
      <style jsx>{`
                .dot {
                    width: 1.25rem;
                    height: 1.25rem;
                    background-color: #1f2937; /* gray-800 */
                    border-radius: 50%;
                }
                @media (min-width: 640px) {
                    .dot {
                        width: 1.5rem;
                        height: 1.5rem;
                    }
                }
            `}</style>
    </div>
  );
};


export default function DiceRollPage() {
  const [result, setResult] = useState(6);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    triggerHapticFeedback();
    setIsRolling(true);
    // A random duration for the roll to feel more natural
    const rollDuration = Math.random() * 500 + 750;

    setTimeout(() => {
      const newResult = Math.floor(Math.random() * 6) + 1;
      setResult(newResult);
      setIsRolling(false);
    }, rollDuration);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Dice Roller</h1>
        <p className="mt-2 mb-8 text-lg text-gray-600 dark:text-gray-400">Click the button to roll the dice!</p>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-8">
          <div className={`transition-transform duration-500 ${isRolling ? 'animate-spin' : ''}`}>
            <DiceFace number={result} />
          </div>

          <div className="w-full flex flex-col items-center">
            <button
              className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 ease-in-out text-xl font-bold shadow-lg disabled:bg-blue-400 dark:disabled:bg-blue-800/50 disabled:cursor-not-allowed"
              onClick={rollDice}
              disabled={isRolling}
            >
              {isRolling ? 'Rolling...' : 'Roll Dice'}
            </button>

            {!isRolling && (
              <p className="mt-6 text-2xl font-semibold text-gray-800 dark:text-gray-200 transition-opacity duration-300">
                You rolled a {result}!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
