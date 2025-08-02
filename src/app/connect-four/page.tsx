'use client';

import { useState, useEffect, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { RefreshCw, User, Bot, Crown } from 'lucide-react';

// --- Game Constants and Types ---
const ROWS = 6;
const COLS = 7;
type Player = 1 | 2;
type GameMode = 'playerVsPlayer' | 'playerVsComputer';

const ConnectFourPage = () => {
  const [board, setBoard] = useState<(Player | null)[][]>(() => Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<[number, number][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('playerVsPlayer');
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  const resetGame = useCallback(() => {
    triggerHapticFeedback();
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setCurrentPlayer(1);
    setWinner(null);
    setWinningLine([]);
    setGameOver(false);
  }, []);

  useEffect(() => {
    resetGame();
  }, [gameMode, resetGame]);

  const checkForWin = (currentBoard: (Player | null)[][]): { winner: Player | 'draw' | null, line: [number, number][] } => {
    const checkLine = (a: Player | null, b: Player | null, c: Player | null, d: Player | null) => a && a === b && a === c && a === d;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (c <= COLS - 4) {
          if (checkLine(currentBoard[r][c], currentBoard[r][c + 1], currentBoard[r][c + 2], currentBoard[r][c + 3])) return { winner: currentBoard[r][c], line: [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]] };
        }
        if (r <= ROWS - 4) {
          if (checkLine(currentBoard[r][c], currentBoard[r + 1][c], currentBoard[r + 2][c], currentBoard[r + 3][c])) return { winner: currentBoard[r][c], line: [[r, c], [r + 1, c], [r + 2, c], [r + 3, c]] };
        }
        if (r <= ROWS - 4 && c <= COLS - 4) {
          if (checkLine(currentBoard[r][c], currentBoard[r + 1][c + 1], currentBoard[r + 2][c + 2], currentBoard[r + 3][c + 3])) return { winner: currentBoard[r][c], line: [[r, c], [r + 1, c + 1], [r + 2, c + 2], [r + 3, c + 3]] };
        }
        if (r >= 3 && c <= COLS - 4) {
          if (checkLine(currentBoard[r][c], currentBoard[r - 1][c + 1], currentBoard[r - 2][c + 2], currentBoard[r - 3][c + 3])) return { winner: currentBoard[r][c], line: [[r, c], [r - 1, c + 1], [r - 2, c + 2], [r - 3, c + 3]] };
        }
      }
    }

    if (currentBoard.flat().every(cell => cell !== null)) return { winner: 'draw', line: [] };
    return { winner: null, line: [] };
  };

  const makeMove = useCallback((colIndex: number) => {
    if (gameOver || board[0][colIndex] !== null) return;

    const newBoard = board.map(row => [...row]);
    let endRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newBoard[r][colIndex] === null) {
        newBoard[r][colIndex] = currentPlayer;
        endRow = r;
        break;
      }
    }
    if (endRow === -1) return;

    setBoard(newBoard);
    const { winner: newWinner, line } = checkForWin(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setWinningLine(line);
      setGameOver(true);
      if (newWinner !== 'draw') {
        setScores(s => ({ ...s, [newWinner === 1 ? 'player1' : 'player2']: s[newWinner === 1 ? 'player1' : 'player2'] + 1 }));
      }
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  }, [board, currentPlayer, gameOver]);

  const handleColumnClick = (colIndex: number) => {
    if (gameMode === 'playerVsComputer' && currentPlayer === 2) return;
    triggerHapticFeedback();
    makeMove(colIndex);
  };

  useEffect(() => {
    if (gameMode === 'playerVsComputer' && currentPlayer === 2 && !gameOver) {
      const timer = setTimeout(() => {
        let bestMove = -1;
        // AI logic here...
        const availableCols = [];
        for (let c = 0; c < COLS; c++) if (board[0][c] === null) availableCols.push(c);
        bestMove = availableCols[Math.floor(Math.random() * availableCols.length)];

        if (bestMove !== -1) {
          makeMove(bestMove);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, gameOver, board, makeMove]);

  const getPlayerColor = (player: Player | null) => {
    if (player === 1) return 'bg-red-500';
    if (player === 2) return 'bg-yellow-400';
    return 'bg-white dark:bg-gray-700';
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Connect Four</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button onClick={() => setGameMode('playerVsPlayer')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${gameMode === 'playerVsPlayer' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><User size={16} /> Player</button>
              <button onClick={() => setGameMode('playerVsComputer')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${gameMode === 'playerVsComputer' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><Bot size={16} /> Computer</button>
            </div>
            <button onClick={resetGame} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"><RefreshCw size={20} /></button>
          </div>
          <div className="flex justify-around mb-4 text-lg font-semibold">
            <span>Player 1: {scores.player1}</span>
            <span>{gameMode === 'playerVsComputer' ? 'Computer' : 'Player 2'}: {scores.player2}</span>
          </div>

          <div className="bg-blue-600 p-2 sm:p-3 rounded-lg shadow-xl relative">
            {gameOver && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 rounded-lg text-center p-4">
                <p className="text-5xl font-extrabold text-white">
                  {winner === 'draw' ? 'Draw!' : <><Crown className="inline-block mb-2" /> Player {winner} Wins!</>}
                </p>
                <button onClick={resetGame} className="mt-6 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors text-lg">Play Again</button>
              </div>
            )}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {board.map((row, rowIndex) => (
                row.map((cell, colIndex) => {
                  const isWinning = winningLine.some(([r, c]) => r === rowIndex && c === colIndex);
                  return (
                    <div key={`${rowIndex}-${colIndex}`} className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer" onClick={() => handleColumnClick(colIndex)}>
                      <div className={`w-full h-full rounded-full transition-all duration-200 ${getPlayerColor(cell)} ${isWinning ? 'ring-4 ring-white' : ''} shadow-inner`}></div>
                    </div>
                  )
                })
              ))}
            </div>
          </div>
          {!gameOver && (
            <p className="mt-4 text-2xl font-semibold text-center text-gray-700 dark:text-gray-300">
              Player {currentPlayer}'s Turn
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ConnectFourPage;
