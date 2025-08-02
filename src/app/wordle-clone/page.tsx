'use client';

import { useState, useEffect, useCallback } from 'react';
import { generate, generate as randomWords } from 'random-words';
import { triggerHapticFeedback } from '@/utils/haptics';
import { RefreshCw, Share2, CornerDownLeft } from 'lucide-react';

// --- Game Constants and Types ---
const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
type GameStatus = 'playing' | 'won' | 'lost';

// --- Helper Functions ---

const getGuessStatuses = (guess: string, solution: string): string[] => {
  const solutionChars = solution.split('');
  const guessChars = guess.split('');
  const statuses = Array(WORD_LENGTH).fill('absent');

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === solutionChars[i]) {
      statuses[i] = 'correct';
      solutionChars[i] = '';
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (statuses[i] === 'correct') continue;
    const charIndex = solutionChars.indexOf(guessChars[i]);
    if (charIndex !== -1) {
      statuses[i] = 'present';
      solutionChars[charIndex] = '';
    }
  }
  return statuses;
};

// --- Main Game Component ---

export default function WordleClonePage() {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [message, setMessage] = useState('');
  const [usedKeys, setUsedKeys] = useState<{ [key: string]: string }>({});
  const [isHardMode, setIsHardMode] = useState(false);

  const resetGame = useCallback(() => {
    triggerHapticFeedback();
    const newSolution = generate({ minLength: 5, maxLength: 5 }) as string;
    setSolution(newSolution.toLowerCase());
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setMessage('');
    setUsedKeys({});
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleKeyPress = useCallback((key: string) => {
    triggerHapticFeedback();
    if (gameStatus !== 'playing') return;

    if (key === 'Enter') {
      if (currentGuess.length !== WORD_LENGTH) {
        showMessage('Not enough letters');
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);

      const statuses = getGuessStatuses(currentGuess, solution);
      const newUsedKeys = { ...usedKeys };
      currentGuess.split('').forEach((char, i) => {
        const status = statuses[i];
        const existingStatus = newUsedKeys[char];
        if (status === 'correct' || existingStatus === 'correct') {
          newUsedKeys[char] = 'correct';
        } else if (status === 'present' || existingStatus === 'present') {
          newUsedKeys[char] = 'present';
        } else {
          newUsedKeys[char] = 'absent';
        }
      });
      setUsedKeys(newUsedKeys);

      setCurrentGuess('');

      if (currentGuess === solution) {
        setGameStatus('won');
        showMessage('You won! 🎉');
      } else if (newGuesses.length === MAX_GUESSES) {
        setGameStatus('lost');
        showMessage(`Game Over! The word was ${solution.toUpperCase()}`);
      }
    } else if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key)) {
      if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key.toLowerCase());
      }
    }
  }, [currentGuess, guesses, gameStatus, solution, usedKeys]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKeyPress(e.key);
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const shareResults = () => {
    triggerHapticFeedback();
    const shareableGrid = guesses.map(guess =>
      getGuessStatuses(guess, solution).map(status => {
        if (status === 'correct') return '🟩';
        if (status === 'present') return '🟨';
        return '⬛';
      }).join('')
    ).join('\n');
    navigator.clipboard.writeText(`Wordle Clone ${guesses.length}/${MAX_GUESSES}\n\n${shareableGrid}`);
    showMessage('Results copied to clipboard!');
  };

  const GameGrid = () => (
    <div className="grid grid-rows-6 gap-1.5">
      {Array.from({ length: MAX_GUESSES }).map((_, i) => {
        const guess = guesses[i];
        const isCurrentRow = i === guesses.length;
        const statuses = guess ? getGuessStatuses(guess, solution) : [];

        return (
          <div key={i} className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: WORD_LENGTH }).map((_, j) => {
              const char = isCurrentRow ? currentGuess[j] : (guess ? guess[j] : '');
              const status = guess ? statuses[j] : null;

              const tileColor =
                status === 'correct' ? 'bg-green-500 border-green-500 text-white' :
                  status === 'present' ? 'bg-yellow-500 border-yellow-500 text-white' :
                    status === 'absent' ? 'bg-gray-500 border-gray-500 text-white' :
                      'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600';

              return (
                <div key={j} className={`w-14 h-14 sm:w-16 sm:h-16 border-2 flex items-center justify-center text-3xl font-bold uppercase transition-all duration-300 ${tileColor}`}>
                  {char}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  const Keyboard = () => {
    const keys = [
      'qwertyuiop'.split(''),
      'asdfghjkl'.split(''),
      ['Enter', ...'zxcvbnm'.split(''), 'Backspace'],
    ];

    return (
      <div className="flex flex-col gap-1.5 mt-6">
        {keys.map((row, i) => (
          <div key={i} className="flex justify-center gap-1.5">
            {row.map((key) => {
              const status = usedKeys[key.toLowerCase()];
              const keyColor =
                status === 'correct' ? 'bg-green-500 text-white' :
                  status === 'present' ? 'bg-yellow-500 text-white' :
                    status === 'absent' ? 'bg-gray-500 text-white' :
                      'bg-gray-200 dark:bg-gray-600';
              const isSpecialKey = key === 'Enter' || key === 'Backspace';

              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`h-14 rounded font-bold uppercase flex items-center justify-center transition-all duration-200 transform active:scale-95 ${isSpecialKey ? 'px-4 text-xs' : 'flex-1'} ${keyColor}`}
                >
                  {key === 'Backspace' ? <CornerDownLeft /> : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
      <div className="w-full max-w-lg mx-auto">
        <header className="relative w-full text-center border-b border-gray-300 dark:border-gray-600 pb-2 mb-4">
          <h1 className="text-4xl font-bold">Wordle Clone</h1>
          {message && <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md transition-opacity duration-300">{message}</div>}
        </header>

        <div className="flex-grow flex items-center justify-center">
          <GameGrid />
        </div>

        {gameStatus !== 'playing' && (
          <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-20">
            <h2 className="text-3xl font-bold mb-2 text-white">{gameStatus === 'won' ? 'You Won!' : 'Game Over'}</h2>
            <p className="mb-4 text-lg text-white">The word was: <strong className="uppercase">{solution}</strong></p>
            <div className="flex gap-4">
              <button onClick={resetGame} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-lg flex items-center gap-2"><RefreshCw size={20} /> Play Again</button>
              <button onClick={shareResults} className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 text-lg flex items-center gap-2"><Share2 size={20} /> Share</button>
            </div>
          </div>
        )}

        <div className="w-full max-w-lg">
          <Keyboard />
        </div>
      </div>
    </main>
  );
};
