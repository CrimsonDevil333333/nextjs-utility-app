'use client';

import { useState } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

export default function CoinTossPage() {
  const [result, setResult] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);

  const tossCoin = () => {
    setIsFlipping(true);
    setResult('');
    triggerHapticFeedback();
    setTimeout(() => {
      const random = Math.random();
      if (random < 0.5) {
        setResult('Heads');
      } else {
        setResult('Tails');
      }
      setIsFlipping(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Coin Toss</h1>
      <div className="flex flex-col items-center">
        <div className="text-6xl mb-8">
          {isFlipping ? '🤔' : result ? (result === 'Heads' ? '🌕' : '🌑') : '🪙'}
        </div>
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xl"
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
      </div>
    </div>
  );
}