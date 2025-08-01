'use client';

import { useState, useEffect, useCallback } from 'react';
import { generate } from 'random-words';
import { triggerHapticFeedback } from '@/utils/haptics';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Generates a random word for the game
const getRandomWord = () => {
  return generate({ minLength: 5, maxLength: 10 }) as string;
};

// --- UI Components ---

/**
 * Renders the SVG drawing of the hangman based on the number of wrong guesses.
 */
const HangmanDrawing = ({ numberOfGuesses }: { numberOfGuesses: number }) => {
  const Head = <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-black dark:border-white rounded-full absolute top-[48px] sm:top-[60px] right-[-20px] sm:right-[-28px]" />;
  const Body = <div className="w-1 h-24 sm:w-1.5 sm:h-32 bg-black dark:bg-white absolute top-[95px] sm:top-[120px] right-0" />;
  const RightArm = <div className="w-20 h-1.5 bg-black dark:bg-white absolute top-[120px] sm:top-[150px] right-[-80px] rotate-[-30deg] origin-bottom-left" />;
  const LeftArm = <div className="w-20 h-1.5 bg-black dark:bg-white absolute top-[120px] sm:top-[150px] right-[4px] rotate-[30deg] origin-bottom-right" />;
  const RightLeg = <div className="w-24 h-1.5 bg-black dark:bg-white absolute top-[210px] sm:top-[248px] right-[-92px] rotate-[60deg] origin-bottom-left" />;
  const LeftLeg = <div className="w-24 h-1.5 bg-black dark:bg-white absolute top-[210px] sm:top-[248px] right-[0px] rotate-[-60deg] origin-bottom-right" />;

  const bodyParts = [Head, Body, RightArm, LeftArm, RightLeg, LeftLeg];

  return (
    <div className="relative">
      {bodyParts.slice(0, numberOfGuesses)}
      <div className="h-12 sm:h-16 w-1.5 bg-black dark:bg-white absolute top-0 right-0" />
      <div className="h-1.5 w-48 sm:w-64 bg-black dark:bg-white ml-24 sm:ml-32" />
      <div className="h-80 sm:h-96 w-1.5 bg-black dark:bg-white ml-24 sm:ml-32" />
      <div className="h-1.5 w-64 sm:w-80 bg-black dark:bg-white" />
    </div>
  );
};

/**
 * Renders the secret word with guessed letters revealed and underscores for unguessed letters.
 */
const HangmanWord = ({ secretWord, guessedLetters }: { secretWord: string; guessedLetters: string[] }) => (
  <div className="flex gap-2 sm:gap-4 justify-center text-3xl sm:text-5xl font-bold font-mono tracking-widest">
    {secretWord.split('').map((letter, index) => (
      <span key={index} className="border-b-4 border-gray-800 dark:border-gray-300 w-10 sm:w-12 h-14 sm:h-16 flex items-center justify-center">
        <span className={guessedLetters.includes(letter) ? 'visible' : 'invisible'}>
          {letter.toUpperCase()}
        </span>
      </span>
    ))}
  </div>
);

/**
 * Renders the on-screen keyboard for guessing letters.
 */
const Keyboard = ({ activeLetters, inactiveLetters, onGuess }: { activeLetters: string[]; inactiveLetters: string[]; onGuess: (letter: string) => void }) => (
  <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
    {ALPHABET.map(letter => {
      const isActive = activeLetters.includes(letter);
      const isInactive = inactiveLetters.includes(letter);
      return (
        <button
          key={letter}
          onClick={() => onGuess(letter)}
          disabled={isActive || isInactive}
          className={`
                        w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl font-bold rounded-lg transition-all duration-200
                        ${isActive ? 'bg-blue-500 text-white' : ''}
                        ${isInactive ? 'bg-red-500 text-white opacity-60' : ''}
                        ${!isActive && !isInactive ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' : ''}
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
        >
          {letter.toUpperCase()}
        </button>
      );
    })}
  </div>
);


// --- Main Page Component ---

const HangmanPage = () => {
  const [secretWord, setSecretWord] = useState(getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const wrongGuesses = guessedLetters.filter(letter => !secretWord.includes(letter));
  const correctGuesses = guessedLetters.filter(letter => secretWord.includes(letter));

  const isLoser = wrongGuesses.length >= 6;
  const isWinner = secretWord.split('').every(letter => guessedLetters.includes(letter));
  const isGameOver = isWinner || isLoser;

  const startNewGame = useCallback(() => {
    triggerHapticFeedback();
    setSecretWord(getRandomWord());
    setGuessedLetters([]);
  }, []);

  const handleGuess = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isGameOver) return;
    triggerHapticFeedback();
    setGuessedLetters(currentLetters => [...currentLetters, letter]);
  }, [guessedLetters, isGameOver]);

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Hangman Challenge</h1>
          {isWinner && <p className="text-green-500 text-xl mt-2">Congratulations, you won!</p>}
          {isLoser && <p className="text-red-500 text-xl mt-2">Nice try! The word was: <span className="font-bold">{secretWord.toUpperCase()}</span></p>}
        </div>

        <HangmanDrawing numberOfGuesses={wrongGuesses.length} />
        <HangmanWord secretWord={secretWord} guessedLetters={guessedLetters} />

        <div className="self-stretch">
          <Keyboard
            activeLetters={correctGuesses}
            inactiveLetters={wrongGuesses}
            onGuess={handleGuess}
          />
        </div>

        <button
          onClick={startNewGame}
          className="mt-4 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default HangmanPage;
