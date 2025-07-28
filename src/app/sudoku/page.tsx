
'use client';

import { useState, useEffect } from 'react';

const emptyBoard = Array(9).fill(null).map(() => Array(9).fill(0));

const solve = (board: number[][]): boolean => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffle(nums);
        for (const num of nums) {
          if (isValid(board, i, j, num)) {
            board[i][j] = num;
            if (solve(board)) {
              return true;
            }
            board[i][j] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }
  return true;
};

const shuffle = (array: number[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export default function SudokuPage() {
  const [board, setBoard] = useState<number[][]>(emptyBoard);
  const [initial, setInitial] = useState<number[][]>(emptyBoard);
  const [incorrectCells, setIncorrectCells] = useState<boolean[][]>(
    Array(9).fill(null).map(() => Array(9).fill(false))
  );
  const [solution, setSolution] = useState<number[][]>(emptyBoard);

  useEffect(() => {
    generateNewGame();
  }, []);

  const generateNewGame = () => {
    const newBoard = JSON.parse(JSON.stringify(emptyBoard));
    solve(newBoard);
    setSolution(JSON.parse(JSON.stringify(newBoard)));

    // Remove some numbers to create the puzzle
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Math.random() > 0.5) {
          newBoard[i][j] = 0;
        }
      }
    }

    setBoard(newBoard);
    setInitial(newBoard);
    setIncorrectCells(Array(9).fill(null).map(() => Array(9).fill(false)));
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    if (initial[row][col] !== 0) {
      return;
    }

    const newBoard = board.map(r => [...r]);
    const num = parseInt(value, 10);

    if (!isNaN(num) && num >= 1 && num <= 9) {
      newBoard[row][col] = num;
    } else {
      newBoard[row][col] = 0;
    }
    setBoard(newBoard);

    const newIncorrectCells = incorrectCells.map(r => [...r]);
    newIncorrectCells[row][col] = value !== '' && parseInt(value, 10) !== solution[row][col];
    setIncorrectCells(newIncorrectCells);
  };

  const solveSudoku = () => {
    setBoard(solution);
    setIncorrectCells(Array(9).fill(null).map(() => Array(9).fill(false)));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Sudoku</h1>
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-9 gap-1 bg-gray-300 dark:bg-gray-600 p-1 rounded-lg">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                maxLength={1}
                value={cell === 0 ? '' : cell}
                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                className={`w-12 h-12 text-center text-xl font-bold border ${
                  initial[rowIndex][colIndex] !== 0
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    : 'bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-gray-100'
                } ${
                  incorrectCells[rowIndex][colIndex]
                    ? 'text-red-500 border-red-500'
                    : 'border-gray-400 dark:border-gray-500'
                }`}
                readOnly={initial[rowIndex][colIndex] !== 0}
              />
            ))
          )}
        </div>
        <div className="mt-6 flex space-x-4">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xl"
            onClick={generateNewGame}
          >
            New Game
          </button>
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xl"
            onClick={solveSudoku}
          >
            Solve
          </button>
        </div>
      </div>
    </div>
  );
}
