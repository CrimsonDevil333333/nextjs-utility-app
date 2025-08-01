'use client';

import { useState, useEffect, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { X, Circle, RefreshCw, User, Bot } from 'lucide-react';

type Player = 'X' | 'O';
type GameMode = 'playerVsPlayer' | 'playerVsAi';

export default function TicTacToePage() {
  const [board, setBoard] = useState<(Player | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [gameMode, setGameMode] = useState<GameMode>('playerVsPlayer');

  const { winner, winningLine } = calculateWinner(board);
  const isDraw = board.every(Boolean) && !winner;

  const makeMove = useCallback((i: number) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  }, [board, isXNext, winner]);

  const handleClick = (i: number) => {
    if (gameMode === 'playerVsAi' && !isXNext) return;
    triggerHapticFeedback();
    makeMove(i);
  };

  useEffect(() => {
    if (gameMode === 'playerVsAi' && !isXNext && !winner && !isDraw) {
      const AiMove = () => {
        for (let i = 0; i < 9; i++) {
          if (!board[i]) {
            const newBoard = [...board];
            newBoard[i] = 'O';
            if (calculateWinner(newBoard).winner === 'O') {
              makeMove(i);
              return;
            }
          }
        }
        for (let i = 0; i < 9; i++) {
          if (!board[i]) {
            const newBoard = [...board];
            newBoard[i] = 'X';
            if (calculateWinner(newBoard).winner === 'X') {
              makeMove(i);
              return;
            }
          }
        }
        const emptySquares = board.map((sq, i) => sq === null ? i : null).filter(i => i !== null);
        if (emptySquares.length > 0) {
          const randomMove = emptySquares[Math.floor(Math.random() * emptySquares.length)] as number;
          makeMove(randomMove);
        }
      };
      setTimeout(AiMove, 500);
    }
  }, [isXNext, gameMode, board, winner, isDraw, makeMove]);

  useEffect(() => {
    if (winner) {
      setScores(prevScores => ({
        ...prevScores,
        [winner]: prevScores[winner as Player] + 1
      }));
    }
  }, [winner]);

  const renderSquare = (i: number) => {
    const isWinnerSquare = winningLine?.includes(i);

    return (
      <button
        key={i}
        className={`aspect-square w-full bg-gray-200 dark:bg-gray-700 text-4xl font-bold transition-colors duration-300 border border-gray-400 dark:border-gray-600 ${isWinnerSquare ? 'bg-green-400 dark:bg-green-800' : ''}`}
        onClick={() => handleClick(i)}
        disabled={!!board[i] || !!winner || (gameMode === 'playerVsAi' && !isXNext)}
      >
        {board[i] === 'X' && <X className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-blue-500" />}
        {board[i] === 'O' && <Circle className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-red-500" />}
      </button>
    );
  };

  const getStatus = () => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return 'Draw!';
    return `Next player: ${isXNext ? 'X' : 'O'}`;
  };

  const resetGame = () => {
    triggerHapticFeedback();
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const resetScores = () => {
    triggerHapticFeedback();
    setScores({ X: 0, O: 0 });
  };

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Tic Tac Toe</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-4">
            <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
              <button onClick={() => { setGameMode('playerVsPlayer'); resetGame(); }} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${gameMode === 'playerVsPlayer' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}><User size={16} /> Player</button>
              <button onClick={() => { setGameMode('playerVsAi'); resetGame(); }} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${gameMode === 'playerVsAi' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}><Bot size={16} /> Ai</button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl sm:text-2xl font-semibold">{getStatus()}</div>
            <div className="flex gap-4 text-sm sm:text-base">
              <span>X Wins: {scores.X}</span>
              <span>O Wins: {scores.O}</span>
            </div>
          </div>

          {/* ✅ Perfect grid with no spacing issues */}
          <div className="grid grid-cols-3 gap-0 w-full grid-[border-collapse:collapse]">
            {Array.from({ length: 9 }).map((_, i) => renderSquare(i))}
          </div>

          <div className="mt-6 flex gap-4">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg" onClick={resetGame}>
              <RefreshCw size={20} /> Reset Game
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-lg" onClick={resetScores}>
              Reset Scores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares: (Player | null)[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: lines[i] };
    }
  }
  return { winner: null, winningLine: null };
}
