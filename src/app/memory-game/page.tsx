'use client';

import { useState, useEffect, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

// The set of symbols to be matched.
const SYMBOLS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

// Card interface to define the structure of a card object.
interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// Function to shuffle the cards array.
const shuffleArray = (array: any[]) => {
  return array.slice().sort(() => Math.random() - 0.5);
};

const MemoryGamePage = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Function to initialize or reset the game.
  const setupGame = useCallback(() => {
    triggerHapticFeedback();
    const duplicatedSymbols = [...SYMBOLS, ...SYMBOLS];
    const shuffledSymbols = shuffleArray(duplicatedSymbols);

    const newCards = shuffledSymbols.map((symbol, index) => ({
      id: index,
      symbol: symbol,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
    setFlippedIndices([]);
    setMoves(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    setupGame();
  }, [setupGame]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      setMoves((prevMoves) => prevMoves + 1);

      if (firstCard.symbol === secondCard.symbol) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.symbol === firstCard.symbol ? { ...card, isMatched: true } : card
          )
        );
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card, index) =>
              index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [flippedIndices, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setGameOver(true);
    }
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }
    triggerHapticFeedback();
    setCards((prevCards) =>
      prevCards.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
    );
    setFlippedIndices((prev) => [...prev, index]);
  };

  return (
    <main className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Memory Game</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Match the pairs to win!</p>
        </div>

        <div className="flex justify-between items-center w-full mb-4">
          <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-center">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">MOVES</div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">{moves}</div>
          </div>
          <button onClick={setupGame} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
            New Game
          </button>
        </div>

        <div className="relative w-full aspect-square">
          {gameOver && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 rounded-lg">
              <p className="text-5xl font-extrabold text-white">You Won!</p>
              <p className="text-xl text-white mt-2">Moves: {moves}</p>
              <button onClick={setupGame} className="mt-6 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors text-lg">
                Play Again
              </button>
            </div>
          )}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="w-full aspect-square"
                onClick={() => handleCardClick(index)}
                style={{ perspective: '1000px' }}
              >
                <div
                  className="relative w-full h-full transition-transform duration-500 rounded-lg shadow-md"
                  style={{ transformStyle: 'preserve-3d', transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : '' }}
                >
                  <div className="absolute w-full h-full bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center text-4xl font-bold text-white cursor-pointer" style={{ backfaceVisibility: 'hidden' }}>
                    ?
                  </div>
                  <div
                    className={`absolute w-full h-full rounded-lg flex items-center justify-center text-4xl sm:text-5xl ${card.isMatched ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    {card.symbol}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MemoryGamePage;
