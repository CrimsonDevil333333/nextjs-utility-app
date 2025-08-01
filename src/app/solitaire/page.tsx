'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Crown } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Types and Constants ---
const SUITS = ['♥', '♦', '♣', '♠'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const RANK_VALUES: { [key: string]: number } = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };

interface Card {
  suit: string;
  rank: string;
  isFaceUp: boolean;
  color: 'red' | 'black';
}

interface SelectedCard {
  source: 'tableau' | 'waste' | 'foundation';
  pileIndex: number;
  cardIndex?: number;
}

// --- Game Component ---
const SolitairePage = () => {
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [tableau, setTableau] = useState<Card[][]>([[], [], [], [], [], [], []]);
  const [selected, setSelected] = useState<SelectedCard | null>(null);
  const [isWin, setIsWin] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const initializeGame = useCallback(() => {
    triggerHapticFeedback();
    let deck: Card[] = [];
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({ suit, rank, isFaceUp: false, color: (suit === '♥' || suit === '♦') ? 'red' : 'black' });
      }
    }
    deck = deck.sort(() => Math.random() - 0.5);

    const newTableau: Card[][] = Array.from({ length: 7 }, () => []);
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        newTableau[j].push(deck.pop()!);
      }
    }
    newTableau.forEach(pile => {
      if (pile.length > 0) pile[pile.length - 1].isFaceUp = true;
    });

    setTableau(newTableau);
    setStock(deck);
    setFoundations([[], [], [], []]);
    setWaste([]);
    setSelected(null);
    setIsWin(false);
    setMoves(0);
    setTime(0);
    setIsTimerRunning(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (foundations.flat().length === 52) {
      setIsWin(true);
      setIsTimerRunning(false);
    }
  }, [foundations]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const startTimer = () => {
    if (!isTimerRunning && !isWin) {
      setIsTimerRunning(true);
    }
  };

  const handleStockClick = () => {
    triggerHapticFeedback();
    startTimer();
    setSelected(null);
    if (stock.length > 0) {
      const newStock = [...stock];
      const cardToMove = newStock.pop()!;
      cardToMove.isFaceUp = true;
      setWaste(prevWaste => [...prevWaste, cardToMove]);
      setStock(newStock);
    } else if (waste.length > 0) {
      const newStock = [...waste].reverse().map(c => ({ ...c, isFaceUp: false }));
      setStock(newStock);
      setWaste([]);
    }
    setMoves(m => m + 1);
  };

  const canPlaceOnFoundation = (card: Card, foundationPile: Card[]) => {
    if (foundationPile.length === 0) return card.rank === 'A';
    const topCard = foundationPile[foundationPile.length - 1];
    return card.suit === topCard.suit && RANK_VALUES[card.rank] === RANK_VALUES[topCard.rank] + 1;
  };

  const canPlaceOnTableau = (card: Card, tableauPile: Card[]) => {
    if (tableauPile.length === 0) return card.rank === 'K';
    const topCard = tableauPile[tableauPile.length - 1];
    return card.color !== topCard.color && RANK_VALUES[card.rank] === RANK_VALUES[topCard.rank] - 1;
  };

  const moveCards = (cardsToMove: Card[], source: SelectedCard, dest: { type: 'tableau' | 'foundation', pileIndex: number }) => {
    triggerHapticFeedback();
    startTimer();
    const newTableau = [...tableau];
    const newFoundations = [...foundations];
    const newWaste = [...waste];

    if (source.source === 'tableau' && source.cardIndex !== undefined) {
      newTableau[source.pileIndex] = newTableau[source.pileIndex].slice(0, source.cardIndex);
      const sourcePile = newTableau[source.pileIndex];
      if (sourcePile.length > 0) sourcePile[sourcePile.length - 1].isFaceUp = true;
    } else if (source.source === 'waste') {
      newWaste.pop();
    }

    if (dest.type === 'tableau') {
      newTableau[dest.pileIndex] = [...newTableau[dest.pileIndex], ...cardsToMove];
    } else if (dest.type === 'foundation') {
      newFoundations[dest.pileIndex] = [...newFoundations[dest.pileIndex], ...cardsToMove];
    }

    setTableau(newTableau);
    setFoundations(newFoundations);
    setWaste(newWaste);
    setSelected(null);
    setMoves(m => m + 1);
  };

  const handleCardClick = (source: 'tableau' | 'waste' | 'foundation', pileIndex: number, cardIndex?: number) => {
    triggerHapticFeedback();
    startTimer();
    if (selected) {
      const { source: selectedSource, pileIndex: selectedPileIndex, cardIndex: selectedCardIndex } = selected;
      let cardsToMove: Card[] = [];

      if (selectedSource === 'tableau' && selectedCardIndex !== undefined) {
        cardsToMove = tableau[selectedPileIndex].slice(selectedCardIndex);
      } else if (selectedSource === 'waste' && waste.length > 0) {
        cardsToMove = [waste[waste.length - 1]];
      }

      if (cardsToMove.length > 0) {
        if (source === 'tableau' && canPlaceOnTableau(cardsToMove[0], tableau[pileIndex])) {
          moveCards(cardsToMove, selected, { type: 'tableau', pileIndex });
        } else if (source === 'foundation' && cardsToMove.length === 1 && canPlaceOnFoundation(cardsToMove[0], foundations[pileIndex])) {
          moveCards(cardsToMove, selected, { type: 'foundation', pileIndex });
        } else {
          setSelected(null);
        }
      }
    } else {
      let clickedCard: Card | undefined;
      if (source === 'tableau' && cardIndex !== undefined) clickedCard = tableau[pileIndex][cardIndex];
      else if (source === 'waste') clickedCard = waste[waste.length - 1];

      if (clickedCard?.isFaceUp) {
        for (let i = 0; i < 4; i++) {
          if (canPlaceOnFoundation(clickedCard, foundations[i])) {
            const tempSelected = { source, pileIndex, cardIndex: cardIndex !== undefined ? cardIndex : waste.length - 1 };
            if (source === 'tableau' && cardIndex !== undefined && cardIndex !== tableau[pileIndex].length - 1) {
              setSelected({ source, pileIndex, cardIndex });
              return;
            }
            moveCards([clickedCard], tempSelected, { type: 'foundation', pileIndex: i });
            return;
          }
        }
        setSelected({ source, pileIndex, cardIndex });
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col items-center p-2 sm:p-4 bg-green-800 dark:bg-green-900 min-h-[calc(100vh-4rem)] font-sans">
      <div className="w-full flex justify-between items-center mb-2 sm:mb-4 max-w-7xl">
        <h1 className="text-xl sm:text-3xl font-bold text-white">Solitaire 🃏</h1>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold text-white shadow-md">Moves: {moves}</div>
          <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold text-white shadow-md">Time: {formatTime(time)}</div>
          <button onClick={initializeGame} className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow text-sm sm:text-base">
            <RefreshCw size={18} /> New Game
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl space-y-2 sm:space-y-4">
        <div className="grid grid-cols-7 gap-1 sm:gap-4">
          <div onClick={handleStockClick} className="relative w-full aspect-[2.5/3.5] bg-white/10 rounded-lg flex justify-center items-center text-4xl text-white/50 cursor-pointer border border-white/20">
            {stock.length > 0 ? <CardBack /> : <RefreshCw size={24} />}
          </div>
          <div className={`relative w-full aspect-[2.5/3.5] rounded-lg ${selected?.source === 'waste' ? 'ring-2 ring-blue-400' : ''}`} onClick={() => waste.length > 0 && handleCardClick('waste', 0)}>
            {waste.length > 0 && <CardComponent card={waste[waste.length - 1]} />}
          </div>
          <div className="col-start-4 col-span-4 grid grid-cols-4 gap-1 sm:gap-4">
            {foundations.map((pile, i) => (
              <div key={i} onClick={() => handleCardClick('foundation', i)} className="relative w-full aspect-[2.5/3.5] bg-white/10 rounded-lg border border-dashed border-white/30 flex justify-center items-center text-xl sm:text-2xl text-white/40">
                {pile.length > 0 ? <CardComponent card={pile[pile.length - 1]} /> : <span>{SUITS[i]}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-4">
          {tableau.map((pile, i) => (
            <div key={i} className="relative w-full min-h-[40vh] sm:min-h-[60vh]" onClick={() => pile.length === 0 && handleCardClick('tableau', i)}>
              {pile.map((card, j) => (
                <div
                  key={j}
                  className={`absolute w-full ${selected?.source === 'tableau' && selected.pileIndex === i && selected.cardIndex !== undefined && j >= selected.cardIndex ? 'ring-2 ring-blue-400 rounded-lg' : ''}`}
                  style={{ top: `${j * 1.5}rem` }}
                  onClick={() => handleCardClick('tableau', i, j)}
                >
                  <CardComponent card={card} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {isWin && (
        <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-10">
          <Crown className="text-yellow-400 w-24 h-24 mb-4" />
          <p className="text-5xl font-extrabold text-white">You Won!</p>
          <button onClick={initializeGame} className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-lg">Play Again</button>
        </div>
      )}
    </div>
  );
};

// --- Sub-components for Cards ---
const CardBack = () => <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg border-2 border-blue-800 shadow-md"></div>;

const CardComponent = ({ card }: { card: Card }) => {
  if (!card.isFaceUp) {
    return <CardBack />;
  }
  return (
    <div className={`w-full aspect-[2.5/3.5] bg-white dark:bg-gray-200 rounded-lg shadow-md p-1 sm:p-2 flex flex-col justify-between text-xs sm:text-lg ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
      <span className="font-semibold sm:font-bold">{card.rank}{card.suit}</span>
      <span className="self-center text-lg sm:text-3xl">{card.suit}</span>
      <span className="font-semibold sm:font-bold self-end transform rotate-180">{card.rank}{card.suit}</span>
    </div>
  );
};

export default SolitairePage;
