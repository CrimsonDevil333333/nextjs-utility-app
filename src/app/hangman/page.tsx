'use client';
import { useState, useEffect } from 'react';
import { generate } from 'random-words';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Generate a random word between 5 to 10 characters
const getRandomWord = () => {
  return generate({ minLength: 5, maxLength: 10 }) as string;
};

const HangmanPage = () => {
  const [secretWord, setSecretWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrongGuesses = 6;

  const startNewGame = () => {
    setSecretWord(getRandomWord());
    setGuessedLetters([]);
    setWrongGuesses(0);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleGuess = (letter: string) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);
      if (!secretWord.includes(letter)) {
        setWrongGuesses((prev) => prev + 1);
      }
    }
  };

  const isWinner =
    secretWord && secretWord.split('').every((letter) => guessedLetters.includes(letter));
  const isLoser = wrongGuesses >= maxWrongGuesses;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Hangman</h1>

      <pre className="text-2xl font-mono mb-4">
        {`
  +---+
  |   |
  ${wrongGuesses > 0 ? 'O' : ' '}   |
 ${wrongGuesses > 2 ? '/' : ' '}${wrongGuesses > 1 ? '|' : ' '}${wrongGuesses > 3 ? '\\' : ' '}  |
 ${wrongGuesses > 4 ? '/' : ' '} ${wrongGuesses > 5 ? '\\' : ' '}  |
      |
=========`}
      </pre>

      <p className="text-4xl tracking-widest mb-6">
        {secretWord.split('').map((letter) =>
          guessedLetters.includes(letter) ? letter : '_'
        ).join(' ')}
      </p>

      {isWinner && <p className="text-green-500 text-2xl">You won!</p>}
      {isLoser && <p className="text-red-500 text-2xl">You lost! The word was: {secretWord}</p>}

      {!isWinner && !isLoser && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.includes(letter)}
              className="w-10 h-10 text-lg font-bold bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {letter.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={startNewGame}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        New Game
      </button>
    </div>
  );
};

export default HangmanPage;
