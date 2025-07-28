'use client';

import { useState, useEffect } from 'react';

// An empty 9x9 board represented by a 2D array filled with zeros.
const emptyBoard = Array(9).fill(null).map(() => Array(9).fill(0));

/**
 * Solves the Sudoku board using a backtracking algorithm.
 * @param board The Sudoku board to solve.
 * @returns True if a solution is found, false otherwise.
 */
const solve = (board: number[][]): boolean => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        // Shuffle numbers 1-9 to get a random valid puzzle each time.
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffle(nums);
        for (const num of nums) {
          if (isValid(board, i, j, num)) {
            board[i][j] = num;
            if (solve(board)) {
              return true;
            }
            // Backtrack if the number leads to no solution.
            board[i][j] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

/**
 * Checks if placing a number in a specific cell is valid.
 * @param board The Sudoku board.
 * @param row The row index.
 * @param col The column index.
 * @param num The number to check.
 * @returns True if the move is valid, false otherwise.
 */
const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
  // Check row and column for the same number.
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }
  
  // Check the 3x3 subgrid for the same number.
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

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param array The array to shuffle.
 */
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

  // Generate a new game when the component mounts.
  useEffect(() => {
    generateNewGame();
  }, []);

  /**
   * Generates a new Sudoku puzzle.
   */
  const generateNewGame = () => {
    // Create a deep copy of an empty board.
    const newBoard = JSON.parse(JSON.stringify(emptyBoard));
    // Solve it to get a complete, valid Sudoku grid.
    solve(newBoard);
    // Store the complete solution.
    setSolution(JSON.parse(JSON.stringify(newBoard)));

    // Remove some numbers to create the puzzle for the user.
    // The more numbers are removed, the harder the puzzle.
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // Adjust this probability to change difficulty.
        if (Math.random() > 0.6) {
          newBoard[i][j] = 0;
        }
      }
    }

    setBoard(newBoard);
    // Keep a copy of the initial state to distinguish fixed cells.
    setInitial(JSON.parse(JSON.stringify(newBoard))); 
    // Reset the incorrect cells tracker.
    setIncorrectCells(Array(9).fill(null).map(() => Array(9).fill(false)));
  };

  /**
   * Handles user input in the Sudoku cells.
   * @param row The row index of the changed cell.
   * @param col The column index of the changed cell.
   * @param value The new value from the input.
   */
  const handleInputChange = (row: number, col: number, value: string) => {
    // Prevent changes to the initial, fixed cells.
    if (initial[row][col] !== 0) {
      return;
    }

    // Sanitize input to only allow a single digit from 1-9.
    const sanitizedValue = value.replace(/[^1-9]/g, '');
    const num = sanitizedValue ? parseInt(sanitizedValue, 10) : 0;
    
    // Update the board state with the new number.
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);

    // Update the incorrect cells state.
    const newIncorrectCells = incorrectCells.map(r => [...r]);
    // A cell is incorrect if it has a number and that number doesn't match the solution.
    newIncorrectCells[row][col] = num !== 0 && num !== solution[row][col];
    setIncorrectCells(newIncorrectCells);
  };

  /**
   * Solves the current puzzle by revealing the full solution.
   */
  const solveSudoku = () => {
    setBoard(solution);
    // Clear any incorrect cell markers.
    setIncorrectCells(Array(9).fill(null).map(() => Array(9).fill(false)));
  };

  return (
    // Main container to center the content on the page.
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-2 sm:p-4 font-sans">
      <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Sudoku
      </h1>

      {/* This is the main responsive grid container.
        - `w-full max-w-md` makes it responsive with a max width on larger screens.
        - `aspect-square` ensures it's always a perfect square.
        - The nested grid approach creates the classic Sudoku 3x3 block appearance.
      */}
      <div className="grid grid-cols-3 gap-1 sm:gap-1.5 bg-gray-400 dark:bg-gray-600 p-1 sm:p-2 rounded-lg w-full max-w-md aspect-square shadow-lg">
        {/* Create 9 subgrids (3x3 blocks) */}
        {Array.from({ length: 9 }).map((_, blockIndex) => {
          const startRow = Math.floor(blockIndex / 3) * 3;
          const startCol = (blockIndex % 3) * 3;
          return (
            <div key={blockIndex} className="grid grid-cols-3 gap-1 bg-gray-300 dark:bg-gray-500 rounded-sm">
              {/* Render 9 cells within each block */}
              {Array.from({ length: 9 }).map((_, cellIndex) => {
                const rowIndex = startRow + Math.floor(cellIndex / 3);
                const colIndex = startCol + (cellIndex % 3);
                const cell = board[rowIndex][colIndex];
                const isInitial = initial[rowIndex][colIndex] !== 0;
                const isIncorrect = incorrectCells[rowIndex][colIndex];

                return (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    type="tel" // Use "tel" for a number pad on mobile without extra UI.
                    maxLength={1}
                    value={cell === 0 ? '' : cell}
                    onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                    readOnly={isInitial}
                    className={`
                      w-full aspect-square text-center font-bold text-xl sm:text-2xl transition-colors duration-200 rounded-sm
                      ${isInitial
                        ? 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 cursor-default'
                        : 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 z-10'
                      }
                      ${isIncorrect
                        ? '!text-red-500 !bg-red-200 dark:!bg-red-800/50'
                        : ''
                      }
                    `}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          className="px-5 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-semibold text-base sm:text-lg"
          onClick={generateNewGame}
        >
          New Game
        </button>
        <button
          className="px-5 py-2 sm:px-6 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md font-semibold text-base sm:text-lg"
          onClick={solveSudoku}
        >
          Solve
        </button>
      </div>
    </main>
  );
}
