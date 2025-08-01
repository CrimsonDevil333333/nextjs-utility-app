'use client';

import React, { useState, useEffect, MouseEvent, JSX, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

// Game constants
const ROWS = 10;
const COLS = 10;
const MINES = 15;

// Define the type for a single cell's state
interface CellState {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

const MinesweeperPage = (): JSX.Element => {
  const [board, setBoard] = useState<CellState[][]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);

  const initializeBoard = useCallback((): void => {
    triggerHapticFeedback();
    setGameOver(false);
    setGameWon(false);

    const newBoard: CellState[][] = Array.from({ length: ROWS }, (_, i) =>
      Array.from({ length: COLS }, (_, j) => ({
        x: i,
        y: j,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    );

    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const x = Math.floor(Math.random() * ROWS);
      const y = Math.floor(Math.random() * COLS);
      if (!newBoard[x][y].isMine) {
        newBoard[x][y].isMine = true;
        minesPlaced++;
      }
    }

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (!newBoard[i][j].isMine) {
          let count = 0;
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const ni = i + dx;
              const nj = j + dy;
              if (ni >= 0 && ni < ROWS && nj >= 0 && nj < COLS && newBoard[ni][nj].isMine) {
                count++;
              }
            }
          }
          newBoard[i][j].adjacentMines = count;
        }
      }
    }
    setBoard(newBoard);
  }, []);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  const revealEmptyCells = (currentBoard: CellState[][], x: number, y: number): void => {
    if (x < 0 || x >= ROWS || y < 0 || y >= COLS || currentBoard[x][y].isRevealed || currentBoard[x][y].isFlagged) return;

    currentBoard[x][y].isRevealed = true;
    if (currentBoard[x][y].adjacentMines > 0) return;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx !== 0 || dy !== 0) {
          revealEmptyCells(currentBoard, x + dx, y + dy);
        }
      }
    }
  };

  const checkWinCondition = (currentBoard: CellState[][]): void => {
    const nonMineCells = ROWS * COLS - MINES;
    const revealedNonMines = currentBoard.flat().filter(cell => cell.isRevealed && !cell.isMine).length;
    if (revealedNonMines === nonMineCells) {
      setGameWon(true);
      setGameOver(true);
    }
  };

  const handleCellClick = (x: number, y: number): void => {
    if (gameOver || board[x][y].isFlagged || board[x][y].isRevealed) return;

    triggerHapticFeedback();
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    if (newBoard[x][y].isMine) {
      setGameOver(true);
      newBoard.forEach(row => row.forEach(c => {
        if (c.isMine) c.isRevealed = true;
      }));
    } else {
      revealEmptyCells(newBoard, x, y);
    }

    setBoard(newBoard);
    checkWinCondition(newBoard);
  };

  const handleRightClick = (e: MouseEvent<HTMLDivElement>, x: number, y: number): void => {
    e.preventDefault();
    if (gameOver || board[x][y].isRevealed) return;

    triggerHapticFeedback();
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[x][y].isFlagged = !newBoard[x][y].isFlagged;
    setBoard(newBoard);
  };

  const getNumberColor = (num: number): string => {
    switch (num) {
      case 1: return 'text-blue-500';
      case 2: return 'text-green-500';
      case 3: return 'text-red-500';
      case 4: return 'text-purple-700';
      case 5: return 'text-maroon-500';
      case 6: return 'text-teal-500';
      default: return 'text-gray-500';
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Minesweeper</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Clear the board without hitting a mine.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={initializeBoard}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              New Game
            </button>
            {gameOver && (
              <div className={`text-2xl font-bold ${gameWon ? 'text-green-500' : 'text-red-500'}`}>
                {gameWon ? 'You Won! 🎉' : 'Game Over 😵'}
              </div>
            )}
          </div>

          <div className="grid grid-cols-10 gap-1 bg-gray-500 p-2 rounded-lg shadow-lg">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-full aspect-square border border-gray-400 flex items-center justify-center font-bold text-xl cursor-pointer ${cell.isRevealed ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500'
                    }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                >
                  {!cell.isRevealed && cell.isFlagged && '�'}
                  {cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 && (
                    <span className={getNumberColor(cell.adjacentMines)}>
                      {cell.adjacentMines}
                    </span>
                  )}
                  {cell.isRevealed && cell.isMine && '💣'}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinesweeperPage;