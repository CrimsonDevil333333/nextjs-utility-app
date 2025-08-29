'use client';

import { useState } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { RefreshCw } from 'lucide-react';

export default function CoinTossPage() {
  const [result, setResult] = useState<'Heads' | 'Tails' | ''>('');
  const [isFlipping, setIsFlipping] = useState(false);
  const [scores, setScores] = useState({ heads: 0, tails: 0 });

  const tossCoin = () => {
    if (isFlipping) return;

    setIsFlipping(true);
    setResult('');
    triggerHapticFeedback();

    setTimeout(() => {
      const random = Math.random();
      const newResult = random < 0.5 ? 'Heads' : 'Tails';
      setResult(newResult);
      setScores(prev => ({
        ...prev,
        [newResult.toLowerCase()]: prev[newResult.toLowerCase() as 'heads' | 'tails'] + 1
      }));
      setIsFlipping(false);
    }, 1000);
  };

  const resetScores = () => {
    triggerHapticFeedback();
    setScores({ heads: 0, tails: 0 });
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Coin Toss</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Click the button to flip a coin.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center">
          <div className="w-48 h-48 perspective-1000">
            <div
              className="relative w-full h-full transition-transform duration-1000"
              style={{ transformStyle: 'preserve-3d', transform: isFlipping ? 'rotateY(1800deg)' : (result === 'Tails' ? 'rotateY(180deg)' : 'rotateY(0deg)') }}
            >
              {/* Heads Side */}
              <div className="absolute w-full h-full bg-yellow-400 rounded-full flex items-center justify-center text-4xl font-bold text-yellow-800 border-4 border-yellow-500" style={{ backfaceVisibility: 'hidden' }}>
                H
              </div>
              {/* Tails Side */}
              <div className="absolute w-full h-full bg-gray-400 rounded-full flex items-center justify-center text-4xl font-bold text-gray-800 border-4 border-gray-500" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                T
              </div>
            </div>
          </div>

          <button
            className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xl font-bold shadow-lg disabled:bg-blue-400/50"
            onClick={tossCoin}
            disabled={isFlipping}
          >
            {isFlipping ? 'Flipping...' : 'Toss Coin'}
          </button>

          {result && !isFlipping && (
            <p className="mt-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              It's {result}!
            </p>
          )}

          <div className="mt-8 w-full flex justify-around p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-semibold">Heads</p>
              <p className="text-2xl font-bold">{scores.heads}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Tails</p>
              <p className="text-2xl font-bold">{scores.tails}</p>
            </div>
            <button onClick={resetScores} className="self-center p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
