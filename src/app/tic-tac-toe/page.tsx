'use client';

import { useState } from 'react';

type Player = 'X' | 'O';

export default function TicTacToePage() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const renderSquare = (i: number) => {
    return (
      <button
        className="w-24 h-24 bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-4xl 
   font-bold text-gray-900 dark:text-gray-100"
        onClick={() => handleClick(i)}
      >
        {board[i]}
      </button>
    );
  };

  const getStatus = () => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (board.every(Boolean)) {
      return 'Draw!';
    } else {
      return `Next player: ${isXNext ? 'X' : 'O'}`;
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Tic Tac Toe</h1>
      <div className="flex flex-col items-center">
        <div className="text-xl mb-4">{getStatus()}</div>
        <div className="grid grid-cols-3 gap-1">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}

function calculateWinner(squares: (Player | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}