'use client';

import React, { useState, useEffect, MouseEvent, JSX } from 'react';

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
  // Explicitly type the state as a 2D array of CellState objects
  const [board, setBoard] = useState<CellState[][]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);

  // Function to initialize or reset the board
  const initializeBoard = (): void => {
    setGameOver(false);
    setGameWon(false);

    // 1. Create an empty board with the correct type
    const newBoard: CellState[][] = [];
    for (let i = 0; i < ROWS; i++) {
      const row: CellState[] = [];
      for (let j = 0; j < COLS; j++) {
        row.push({
          x: i,
          y: j,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        });
      }
      newBoard.push(row);
    }

    // 2. Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const x = Math.floor(Math.random() * ROWS);
      const y = Math.floor(Math.random() * COLS);
      if (!newBoard[x][y].isMine) {
        newBoard[x][y].isMine = true;
        minesPlaced++;
      }
    }

    // 3. Calculate adjacent mines for each cell
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (!newBoard[i][j].isMine) {
          let count = 0;
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (dx === 0 && dy === 0) continue;
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
  };

  // Initialize board on component mount
  useEffect(() => {
    initializeBoard();
  }, []);

  // Recursive function to reveal empty cells (flood fill)
  const revealEmptyCells = (currentBoard: CellState[][], x: number, y: number): void => {
    if (x < 0 || x >= ROWS || y < 0 || y >= COLS) return;
    const cell = currentBoard[x][y];
    if (cell.isRevealed || cell.isMine || cell.isFlagged) return;

    cell.isRevealed = true;
    if (cell.adjacentMines > 0) return;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        revealEmptyCells(currentBoard, x + dx, y + dy);
      }
    }
  };
  
  // Check for a win condition
  const checkWinCondition = (currentBoard: CellState[][]): void => {
    const totalNonMines = ROWS * COLS - MINES;
    let revealedNonMines = 0;
    
    for (const row of currentBoard) {
      for (const cell of row) {
        if (cell.isRevealed && !cell.isMine) {
          revealedNonMines++;
        }
      }
    }

    if (revealedNonMines === totalNonMines) {
      setGameWon(true);
      setGameOver(true);
    }
  };

  // Handle left-click on a cell
  const handleCellClick = (x: number, y: number): void => {
    if (gameOver) return;

    // Create a deep copy to ensure re-render
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = newBoard[x][y];

    if (cell.isFlagged || cell.isRevealed) return;

    if (cell.isMine) {
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

  // Handle right-click to flag a cell
  const handleRightClick = (e: MouseEvent<HTMLDivElement>, x: number, y: number): void => {
    e.preventDefault();
    if (gameOver) return;
    
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = newBoard[x][y];

    if (cell.isRevealed) return;
    cell.isFlagged = !cell.isFlagged;
    
    setBoard(newBoard);
  };

  // Helper to get color for the number of adjacent mines
  const getNumberColor = (num: number): string => {
    switch (num) {
      case 1: return 'text-blue-500';
      case 2: return 'text-green-500';
      case 3: return 'text-red-500';
      case 4: return 'text-purple-700';
      case 5: return 'text-maroon-500';
      case 6: return 'text-teal-500';
      case 7: return 'text-black';
      case 8: return 'text-gray-500';
      default: return '';
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Minesweeper</h1>
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={initializeBoard}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
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
              className={`w-8 h-8 md:w-10 md:h-10 border border-gray-400 flex items-center justify-center font-bold text-xl cursor-pointer ${
                cell.isRevealed ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500'
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
            >
              {!cell.isRevealed && cell.isFlagged && '🚩'}
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
  );
};

export default MinesweeperPage;