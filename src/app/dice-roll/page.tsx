'use client';

import { useState, useCallback, useEffect } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { RefreshCw, Target, CheckCircle, XCircle, Dice1, Gamepad2 } from 'lucide-react';

// --- Reusable Components ---

const DiceFace = ({ number }: { number: number }) => {
  const Dot = ({ className = '' }: { className?: string }) => <div className={`w-5 h-5 sm:w-6 sm:h-6 bg-gray-800 dark:bg-gray-200 rounded-full ${className}`}></div>;

  const faces: { [key: number]: React.ReactNode } = {
    1: <div className="flex justify-center items-center h-full"><Dot /></div>,
    2: <div className="flex justify-between h-full"><Dot className="self-start" /><Dot className="self-end" /></div>,
    3: <div className="flex justify-between items-center h-full"><Dot className="self-start" /><Dot /><Dot className="self-end" /></div>,
    4: <div className="flex justify-between h-full"><div className="flex flex-col justify-between"><Dot /><Dot /></div><div className="flex flex-col justify-between"><Dot /><Dot /></div></div>,
    5: <div className="flex justify-between h-full"><div className="flex flex-col justify-between"><Dot /><Dot /></div><div className="flex justify-center items-center"><Dot /></div><div className="flex flex-col justify-between"><Dot /><Dot /></div></div>,
    6: <div className="flex justify-between h-full"><div className="flex flex-col justify-between"><Dot /><Dot /><Dot /></div><div className="flex flex-col justify-between"><Dot /><Dot /><Dot /></div></div>,
  };

  return (
    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white dark:bg-gray-100 rounded-2xl shadow-lg p-3 sm:p-4">
      {faces[number] || <div className="flex justify-center items-center h-full">...</div>}
    </div>
  );
};

// --- Main Page Component ---

export default function DiceRollPage() {
  const [dice, setDice] = useState([6]);
  const [displayDice, setDisplayDice] = useState([6]);
  const [isRolling, setIsRolling] = useState(false);
  const [numberOfDice, setNumberOfDice] = useState(1);
  const [history, setHistory] = useState<number[][]>([]);
  const [target, setTarget] = useState(0);
  const [rollsLeft, setRollsLeft] = useState(5);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [gameMode, setGameMode] = useState<'normal' | 'game'>('normal');

  const startGame = useCallback(() => {
    triggerHapticFeedback();
    const newTarget = Math.floor(Math.random() * (numberOfDice * 6 - numberOfDice + 1)) + numberOfDice;
    setTarget(newTarget);
    setRollsLeft(5);
    setHistory([]);
    setGameStatus('playing');
    setIsRolling(false);
  }, [numberOfDice]);

  useEffect(() => {
    if (gameMode === 'game') {
      startGame();
    } else {
      setHistory([]);
    }
  }, [numberOfDice, startGame, gameMode]);

  const rollDice = () => {
    if (isRolling || (gameMode === 'game' && gameStatus !== 'playing')) return;

    triggerHapticFeedback();
    setIsRolling(true);
    const rollDuration = 1000;

    const shuffleInterval = setInterval(() => {
      const shufflingDice = Array.from({ length: numberOfDice }, () => Math.floor(Math.random() * 6) + 1);
      setDisplayDice(shufflingDice);
    }, 50);

    setTimeout(() => {
      clearInterval(shuffleInterval);
      const newDice = Array.from({ length: numberOfDice }, () => Math.floor(Math.random() * 6) + 1);
      const total = newDice.reduce((sum, val) => sum + val, 0);

      setDice(newDice);
      setDisplayDice(newDice);
      setHistory(prev => [newDice, ...prev].slice(0, 5));

      if (gameMode === 'game') {
        setRollsLeft(prev => prev - 1);
        if (total === target) {
          setGameStatus('won');
        } else if (rollsLeft - 1 === 0) {
          setGameStatus('lost');
        }
      }

      setIsRolling(false);
    }, rollDuration);
  };

  const total = dice.reduce((sum, val) => sum + val, 0);

  const handleReset = () => {
    if (gameMode === 'game') {
      startGame();
    } else {
      triggerHapticFeedback();
      setHistory([]);
      setDice(Array(numberOfDice).fill(6));
      setDisplayDice(Array(numberOfDice).fill(6));
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Dice Roller</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{gameMode === 'game' ? 'Roll the dice to hit the target number!' : 'Click the button to roll the dice!'}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-8">
          <div className="flex justify-center w-full">
            <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
              <button onClick={() => { setGameMode('normal'); triggerHapticFeedback(); }} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${gameMode === 'normal' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}><Dice1 size={16} /> Normal</button>
              <button onClick={() => { setGameMode('game'); triggerHapticFeedback(); }} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${gameMode === 'game' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}><Gamepad2 size={16} /> Game</button>
            </div>
          </div>

          {gameMode === 'game' && (
            <div className="flex justify-around w-full">
              <div className="text-center">
                <Target className="mx-auto mb-2" />
                <p className="font-bold text-2xl">{target}</p>
                <p className="text-sm text-gray-500">Target</p>
              </div>
              <div className="text-center">
                <RefreshCw className="mx-auto mb-2" />
                <p className="font-bold text-2xl">{rollsLeft}</p>
                <p className="text-sm text-gray-500">Rolls Left</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            {displayDice.map((result, index) => (
              <div key={index} className="perspective-1000">
                <div
                  className={`transition-transform duration-1000 ${isRolling ? 'animate-dice-roll' : ''}`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <DiceFace number={result} />
                </div>
              </div>
            ))}
          </div>

          {gameStatus !== 'playing' && gameMode === 'game' ? (
            <div className="text-center">
              {gameStatus === 'won' && <CheckCircle className="mx-auto w-16 h-16 text-green-500 mb-4" />}
              {gameStatus === 'lost' && <XCircle className="mx-auto w-16 h-16 text-red-500 mb-4" />}
              <p className="text-2xl font-bold">{gameStatus === 'won' ? 'You Won!' : 'Game Over!'}</p>
              <p className="text-lg">The target was {target}. You rolled {total}.</p>
              <button onClick={startGame} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg">Play Again</button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <button
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 ease-in-out text-xl font-bold shadow-lg disabled:bg-blue-400 dark:disabled:bg-blue-800/50 disabled:cursor-not-allowed"
                onClick={rollDice}
                disabled={isRolling}
              >
                {isRolling ? 'Rolling...' : 'Roll Dice'}
              </button>
              {!isRolling && <p className="mt-6 text-2xl font-semibold text-gray-800 dark:text-gray-200">Total: {total}</p>}
            </div>
          )}

          <div className="w-full space-y-4">
            <div>
              <label htmlFor="dice-count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Dice: {numberOfDice}</label>
              <input id="dice-count" type="range" min="1" max="6" value={numberOfDice} onFocus={triggerHapticFeedback} onChange={(e) => { setNumberOfDice(parseInt(e.target.value)); triggerHapticFeedback(); }} className="w-full" />
            </div>
            {history.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">History</h3>
                  <button onClick={() => setHistory([])} className="text-xs text-blue-500 hover:underline">Clear</button>
                </div>
                <ul className="space-y-2">
                  {history.map((roll, i) => (
                    <li key={i} className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-md text-sm">
                      Roll {history.length - i}: {roll.join(', ')} (Total: {roll.reduce((a, b) => a + b, 0)})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx global>{`
                @keyframes dice-roll {
                    0% { transform: rotateX(0deg) rotateY(0deg); }
                    100% { transform: rotateX(720deg) rotateY(1080deg); }
                }
                .animate-dice-roll {
                    animation: dice-roll 1s ease-out;
                }
            `}</style>
    </div>
  );
}
