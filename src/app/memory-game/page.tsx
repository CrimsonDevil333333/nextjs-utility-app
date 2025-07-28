'use client';

import { useState, useEffect, useCallback } from 'react';

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
    // Create a duplicated and shuffled list of symbols.
    const duplicatedSymbols = [...SYMBOLS, ...SYMBOLS];
    const shuffledSymbols = shuffleArray(duplicatedSymbols);

    // Create the card objects for the new game.
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

  // Set up the game on initial render.
  useEffect(() => {
    setupGame();
  }, [setupGame]);

  // Logic to check for matches whenever two cards are flipped.
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      // Increment moves counter.
      setMoves((prevMoves) => prevMoves + 1);

      // Check if the symbols of the two cards match.
      if (firstCard.symbol === secondCard.symbol) {
        // If they match, update their status to isMatched.
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.symbol === firstCard.symbol ? { ...card, isMatched: true } : card
          )
        );
        setFlippedIndices([]);
      } else {
        // If they don't match, flip them back after a short delay.
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
  
  // Check for game over condition.
  useEffect(() => {
      if(cards.length > 0 && cards.every(card => card.isMatched)) {
          setGameOver(true);
      }
  }, [cards]);


  // Handles the logic when a card is clicked.
  const handleCardClick = (index: number) => {
    // Prevent clicking if the card is already flipped/matched or if two cards are already active.
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    // Flip the clicked card.
    setCards((prevCards) =>
      prevCards.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
    );
    
    // Add the index of the clicked card to the flipped list.
    setFlippedIndices((prev) => [...prev, index]);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-2 sm:p-4 font-sans select-none">
       <div className="flex flex-col items-center w-full max-w-md mx-auto">
         <div className="flex justify-between items-center w-full mb-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-700 dark:text-gray-200">Memory</h1>
            <div className="flex space-x-2">
                <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-center">
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400">MOVES</div>
                    <div className="text-xl font-bold text-gray-800 dark:text-white">{moves}</div>
                </div>
            </div>
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
                        {/* Card Back */}
                        <div className="absolute w-full h-full bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center text-4xl font-bold text-white cursor-pointer" style={{ backfaceVisibility: 'hidden' }}>
                            ?
                        </div>
                        {/* Card Front */}
                        <div 
                            className={`absolute w-full h-full rounded-lg flex items-center justify-center text-4xl sm:text-5xl
                            ${card.isMatched ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}
                            `}
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                            {card.symbol}
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">
            Click on the cards to find matching pairs of animals!
        </p>
      </div>
    </main>
  );
};

export default MemoryGamePage;
