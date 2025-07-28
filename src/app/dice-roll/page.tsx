'use client';

import { useState } from 'react';

export default function DiceRollPage() {
  const [result, setResult] = useState(6);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      const newResult = Math.floor(Math.random() * 6) + 1;
      setResult(newResult);
      setIsRolling(false);
    }, 1000);
  };

  const renderDice = () => {
    const dots = [];
    for (let i = 0; i < result; i++) {
      dots.push(<span key={i} className="dot"></span>);
    }
    return <div className={`dice dice-${result}`}>{dots}</div>;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Dice Roll</h1>
      <div className="flex flex-col items-center">
        <div className="text-6xl mb-8">
          {isRolling ? '🤔' : renderDice()}
        </div>
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xl"
          onClick={rollDice}
          disabled={isRolling}
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </button>
        {!isRolling && (
          <p className="mt-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            You rolled a {result}!
          </p>
        )}
      </div>
      <style jsx>{`
            .dice {
              width: 100px;
              height: 100px;
              background-color: #fff;
              border: 2px solid #000;
              border-radius: 10px;
              display: grid;
              padding: 10px;
            }
            .dot {
              width: 20px;
              height: 20px;
              background-color: #000;
              border-radius: 50%;
            }
            .dice-1 {
              grid-template-columns: 1fr;
              grid-template-rows: 1fr;
              place-items: center;
            }
            .dice-2 {
              grid-template-columns: 1fr 1fr;
              grid-template-rows: 1fr;
              place-items: center;
            }
            .dice-3 {
              grid-template-columns: 1fr 1fr 1fr;
              grid-template-rows: 1fr;
              place-items: center;
            }
            .dice-4 {
              grid-template-columns: 1fr 1fr;
              grid-template-rows: 1fr 1fr;
              place-items: center;
            }
            .dice-5 {
              grid-template-columns: 1fr 1fr 1fr;
              grid-template-rows: 1fr 1fr;
              place-items: center;
            }
            .dice-5 .dot:nth-child(3) {
              grid-column: 2;
              grid-row: 2;
            }
            .dice-6 {
              grid-template-columns: 1fr 1fr;
              grid-template-rows: 1fr 1fr 1fr;
              place-items: center;
            }
          `}</style>
    </div>
  );
}