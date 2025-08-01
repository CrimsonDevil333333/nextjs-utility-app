'use client';

import { useState, useEffect } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

const ROWS = 6;
const COLS = 7;

// Creates an empty board: a 2D array filled with zeros.
const createEmptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const ConnectFourPage = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [winner, setWinner] = useState<number | 'draw' | null>(null);
  const [gameOver, setGameOver] = useState(false);

  /**
   * Resets the game to its initial state.
   */
  const resetGame = () => {
    triggerHapticFeedback();
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setWinner(null);
    setGameOver(false);
  };

  /**
   * Checks for a win condition (four in a row, column, or diagonal).
   * @param currentBoard The current game board.
   * @returns The winning player (1 or 2), 'draw', or null if no winner.
   */
  const checkForWin = (currentBoard: number[][]): number | 'draw' | null => {
    // Helper function to check a line of four cells
    const checkLine = (a: number, b: number, c: number, d: number) => {
      return a !== 0 && a === b && a === c && a === d;
    };

    // Check horizontal lines
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (checkLine(currentBoard[r][c], currentBoard[r][c + 1], currentBoard[r][c + 2], currentBoard[r][c + 3])) {
          return currentBoard[r][c];
        }
      }
    }

    // Check vertical lines
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r <= ROWS - 4; r++) {
        if (checkLine(currentBoard[r][c], currentBoard[r + 1][c], currentBoard[r + 2][c], currentBoard[r + 3][c])) {
          return currentBoard[r][c];
        }
      }
    }

    // Check diagonal (down-right)
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (checkLine(currentBoard[r][c], currentBoard[r + 1][c + 1], currentBoard[r + 2][c + 2], currentBoard[r + 3][c + 3])) {
          return currentBoard[r][c];
        }
      }
    }

    // Check diagonal (up-right)
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (checkLine(currentBoard[r][c], currentBoard[r - 1][c + 1], currentBoard[r - 2][c + 2], currentBoard[r - 3][c + 3])) {
          return currentBoard[r][c];
        }
      }
    }

    // Check for a draw (if board is full)
    if (currentBoard.flat().every(cell => cell !== 0)) {
      return 'draw';
    }

    return null; // No winner yet
  };

  /**
   * Handles a player's move when a column is clicked.
   * @param colIndex The index of the column that was clicked.
   */
  const handleColumnClick = (colIndex: number) => {
    if (gameOver || board[0][colIndex] !== 0) {
      // Do nothing if the game is over or the column is full.
      return;
    }

    triggerHapticFeedback();

    const newBoard = board.map(row => [...row]);

    // Find the first empty row from the bottom in the selected column.
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newBoard[r][colIndex] === 0) {
        newBoard[r][colIndex] = currentPlayer;
        break;
      }
    }

    setBoard(newBoard);

    // Check for a winner after the move.
    const newWinner = checkForWin(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setGameOver(true);
    } else {
      // Switch to the next player.
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  // Maps player number to a Tailwind CSS color class.
  const getPlayerColor = (player: number) => {
    if (player === 1) return 'bg-red-500';
    if (player === 2) return 'bg-yellow-400';
    return 'bg-white dark:bg-gray-700'; // Empty slot
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-2 sm:p-4 font-sans select-none">
      <div className="flex flex-col items-center w-full max-w-lg mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">Connect Four</h1>
        <div className="bg-blue-600 p-2 sm:p-3 rounded-lg shadow-xl relative">
          {gameOver && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 rounded-lg text-center p-4">
              <p className="text-5xl font-extrabold text-white">
                {winner === 'draw' ? 'Draw!' : `Player ${winner} Wins!`}
              </p>
              <button onClick={resetGame} className="mt-6 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors text-lg">
                Play Again
              </button>
            </div>
          )}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {board.flat().map((cell, index) => {
              const colIndex = index % COLS;
              return (
                <div
                  key={index}
                  className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer group"
                  onClick={() => handleColumnClick(colIndex)}
                >
                  <div className={`w-full h-full rounded-full transition-all duration-200 ${getPlayerColor(cell)} group-hover:bg-opacity-70 shadow-inner`}></div>
                </div>
              )
            })}
          </div>
        </div>
        {!gameOver && (
          <p className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Player {currentPlayer}'s Turn
          </p>
        )}
      </div>
    </main>
  );
};

export default ConnectFourPage;
