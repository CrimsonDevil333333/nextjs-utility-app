'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const GRID_SIZE = 4;
const TILE_COLORS: { [key: number]: string } = {
  0: 'bg-gray-300 dark:bg-gray-700',
  2: 'bg-yellow-100 text-yellow-900',
  4: 'bg-yellow-200 text-yellow-900',
  8: 'bg-orange-300 text-orange-900',
  16: 'bg-orange-400 text-white',
  32: 'bg-red-400 text-white',
  64: 'bg-red-500 text-white',
  128: 'bg-yellow-400 text-white',
  256: 'bg-yellow-500 text-white',
  512: 'bg-yellow-600 text-white',
  1024: 'bg-indigo-500 text-white',
  2048: 'bg-indigo-700 text-white',
};

// Creates an empty board
const createEmptyBoard = () => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));

const Game2048Page = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  // Adds a new '2' or '4' tile to a random empty spot
  const addRandomTile = useCallback((currentBoard: number[][]) => {
    const emptyTiles = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (currentBoard[i][j] === 0) {
          emptyTiles.push({ i, j });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      const newBoard = JSON.parse(JSON.stringify(currentBoard));
      newBoard[i][j] = Math.random() < 0.9 ? 2 : 4;
      return newBoard;
    }
    return currentBoard;
  }, []);

  // Initializes the game
  const resetGame = useCallback(() => {
    let newBoard = createEmptyBoard();
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  }, [addRandomTile]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Core logic for sliding and merging a single row
  const slideAndCombine = (row: number[]): { newRow: number[]; mergedScore: number } => {
    // 1. Filter out zeros
    const filteredRow = row.filter(tile => tile !== 0);
    let mergedScore = 0;

    // 2. Merge tiles
    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        const mergedValue = filteredRow[i] * 2;
        filteredRow[i] = mergedValue;
        mergedScore += mergedValue;
        filteredRow.splice(i + 1, 1);
      }
    }

    // 3. Pad with zeros to the right
    const newRow = Array(GRID_SIZE).fill(0);
    filteredRow.forEach((tile, i) => {
      newRow[i] = tile;
    });

    return { newRow, mergedScore };
  };

  // Helper to check if two boards are identical
  const areBoardsEqual = (b1: number[][], b2: number[][]) => JSON.stringify(b1) === JSON.stringify(b2);

  // Helper to rotate the board 90 degrees clockwise
  const rotateClockwise = (currentBoard: number[][]) => {
    const newBoard = createEmptyBoard();
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        newBoard[j][GRID_SIZE - 1 - i] = currentBoard[i][j];
      }
    }
    return newBoard;
  };
  
  // A single move operation (left, right, up, or down)
  const performMove = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    const originalBoard = JSON.parse(JSON.stringify(board));
    let currentBoard = JSON.parse(JSON.stringify(board));
    let totalMergedScore = 0;

    // Rotate board to always handle moves as a "left" slide
    const rotations = { left: 0, right: 2, up: 1, down: 3 };
    for (let i = 0; i < rotations[direction]; i++) {
      currentBoard = rotateClockwise(currentBoard);
    }
    
    // Slide and merge
    for (let i = 0; i < GRID_SIZE; i++) {
      const { newRow, mergedScore } = slideAndCombine(currentBoard[i]);
      currentBoard[i] = newRow;
      totalMergedScore += mergedScore;
    }

    // Rotate back
    for (let i = 0; i < (4 - rotations[direction]) % 4; i++) {
        currentBoard = rotateClockwise(currentBoard);
    }

    setScore(s => s + totalMergedScore);

    // Add a new tile if the board changed
    if (!areBoardsEqual(originalBoard, currentBoard)) {
      currentBoard = addRandomTile(currentBoard);
    }
    
    setBoard(currentBoard);
    
    // Check for game over condition
    const isFull = !currentBoard.flat().includes(0);
    if(isFull) {
        let hasMove = false;
        for(let i = 0; i < GRID_SIZE; i++) {
            for(let j = 0; j < GRID_SIZE; j++) {
                const val = currentBoard[i][j];
                if((j < GRID_SIZE - 1 && currentBoard[i][j+1] === val) || (i < GRID_SIZE - 1 && currentBoard[i+1][j] === val)) {
                    hasMove = true;
                    break;
                }
            }
             if(hasMove) break;
        }
        if(!hasMove) setGameOver(true);
    }

  }, [board, gameOver, addRandomTile]);

  // Keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowLeft': performMove('left'); break;
      case 'ArrowRight': performMove('right'); break;
      case 'ArrowUp': performMove('up'); break;
      case 'ArrowDown': performMove('down'); break;
    }
  }, [performMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 30) { // Swipe threshold
      if (absDx > absDy) {
        performMove(dx > 0 ? 'right' : 'left');
      } else {
        performMove(dy > 0 ? 'down' : 'up');
      }
    }
    setTouchStart(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-2 sm:p-4 font-sans select-none">
      <div className="flex flex-col items-center w-full max-w-md mx-auto">
        <div className="flex justify-between items-center w-full mb-4">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-700 dark:text-gray-200">2048</h1>
          <div className="flex space-x-2">
            <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-center">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400">SCORE</div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{score}</div>
            </div>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
            >
              New Game
            </button>
          </div>
        </div>

        <div
          className="relative bg-gray-400 dark:bg-gray-600 p-2 sm:p-3 rounded-lg w-full aspect-square"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {gameOver && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 rounded-lg">
                <p className="text-5xl font-extrabold text-white">Game Over!</p>
                <button onClick={resetGame} className="mt-4 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors text-lg">
                    Try Again
                </button>
            </div>
          )}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {board.flat().map((tileValue, index) => (
              <div
                key={index}
                className={`aspect-square rounded-md flex items-center justify-center transition-all duration-200
                  ${TILE_COLORS[tileValue] || 'bg-gray-300 dark:bg-gray-700'}
                `}
              >
                {tileValue > 0 && (
                  <span className={`font-extrabold text-2xl sm:text-4xl ${tileValue > 4 ? 'text-white' : ''}`}>
                    {tileValue}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">
            Use your arrow keys or swipe to move the tiles.
        </p>
      </div>
    </main>
  );
};

export default Game2048Page;
