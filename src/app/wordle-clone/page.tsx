'use client';

import { useState, useEffect, useCallback } from 'react';
import { generate } from 'random-words';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

// Helper function to get the status of each character in a guess
const getGuessStatuses = (guess: string, solution: string): string[] => {
  const solutionChars = solution.split('');
  const guessChars = guess.split('');
  const statuses = Array(WORD_LENGTH).fill('absent'); // Default to absent (gray)
  
  // 1st pass: Find correct (green) letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === solutionChars[i]) {
      statuses[i] = 'correct';
      solutionChars[i] = ''; // Mark as used
    }
  }

  // 2nd pass: Find present (yellow) letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (statuses[i] === 'correct') continue;

    const charIndex = solutionChars.indexOf(guessChars[i]);
    if (charIndex !== -1) {
      statuses[i] = 'present';
      solutionChars[charIndex] = ''; // Mark as used
    }
  }

  return statuses;
};


export default function WordleClonePage() {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [usedKeys, setUsedKeys] = useState<{ [key: string]: string }>({});

  const resetGame = useCallback(() => {
    // Generate a single 5-letter word
    const newSolution = generate({ minLength: 5, maxLength: 5 }) as string;
    setSolution(newSolution.toLowerCase());
    setGuesses([]);
    setCurrentGuess('');
    setIsGameOver(false);
    setMessage('');
    setUsedKeys({});
    console.log("New Solution:", newSolution); // For debugging
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);
  
  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleKeyPress = useCallback((key: string) => {
    if (isGameOver) return;

    if (key === 'Enter') {
      if (currentGuess.length !== WORD_LENGTH) {
        showMessage('Not enough letters');
        return;
      }
      
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      
      const statuses = getGuessStatuses(currentGuess, solution);
      const newUsedKeys = {...usedKeys};
      currentGuess.split('').forEach((char, i) => {
        const status = statuses[i];
        const existingStatus = newUsedKeys[char];
        // Green status has the highest priority
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
        setIsGameOver(true);
        showMessage('You won! 🎉');
      } else if (newGuesses.length === MAX_GUESSES) {
        setIsGameOver(true);
        showMessage(`Game Over! The word was ${solution.toUpperCase()}`);
      }
    } else if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key)) {
      if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key.toLowerCase());
      }
    }
  }, [currentGuess, guesses, isGameOver, solution, usedKeys]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKeyPress(e.key);
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);
  
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
                status === 'absent'  ? 'bg-gray-500 border-gray-500 text-white' :
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
              const status = usedKeys[key];
              const keyColor =
                status === 'correct' ? 'bg-green-500 text-white' :
                status === 'present' ? 'bg-yellow-500 text-white' :
                status === 'absent'  ? 'bg-gray-500 text-white' :
                'bg-gray-200 dark:bg-gray-600';

              const isSpecialKey = key === 'Enter' || key === 'Backspace';
              
              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`h-14 rounded font-bold uppercase flex items-center justify-center transition-colors ${isSpecialKey ? 'px-4 text-xs' : 'flex-1'} ${keyColor}`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-between p-2 sm:p-4 font-sans select-none">
      <header className="relative w-full text-center border-b border-gray-300 dark:border-gray-600 pb-2">
        <h1 className="text-4xl font-bold">Wordle</h1>
        {message && <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md transition-opacity duration-300">{message}</div>}
      </header>
      
      <div className="flex-grow flex items-center justify-center">
        <GameGrid />
      </div>

      {isGameOver && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-2">Game Over</h2>
          <p className="mb-4 text-lg">The word was: <strong className="uppercase">{solution}</strong></p>
          <button onClick={resetGame} className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors text-lg">
            Play Again
          </button>
        </div>
      )}
      
      <div className="w-full max-w-lg">
        <Keyboard />
      </div>
    </main>
  );
};