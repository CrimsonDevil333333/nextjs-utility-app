'use client';

import { useState, useEffect, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { RefreshCw, Lightbulb, CheckCircle, XCircle } from 'lucide-react';

// --- Game Constants & Types ---
const emptyBoard = Array(9).fill(null).map(() => Array(9).fill(0));
type Difficulty = 'easy' | 'medium' | 'hard';

// --- Helper Functions ---

const solve = (board: number[][]): boolean => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffle(nums);
        for (const num of nums) {
          if (isValid(board, i, j, num)) {
            board[i][j] = num;
            if (solve(board)) return true;
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
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
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

// --- Main Game Component ---

export default function SudokuPage() {
  const [board, setBoard] = useState<number[][]>(emptyBoard);
  const [initial, setInitial] = useState<number[][]>(emptyBoard);
  const [solution, setSolution] = useState<number[][]>(emptyBoard);
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [incorrectCells, setIncorrectCells] = useState<boolean[][]>(
    Array(9).fill(null).map(() => Array(9).fill(false))
  );
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isWin, setIsWin] = useState(false);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const generateNewGame = useCallback(() => {
    triggerHapticFeedback();
    const newBoard = JSON.parse(JSON.stringify(emptyBoard));
    solve(newBoard);
    setSolution(JSON.parse(JSON.stringify(newBoard)));

    const removalRates = { easy: 0.5, medium: 0.6, hard: 0.7 };
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Math.random() < removalRates[difficulty]) {
          newBoard[i][j] = 0;
        }
      }
    }

    setBoard(newBoard);
    setInitial(JSON.parse(JSON.stringify(newBoard)));
    setMistakes(0);
    setIncorrectCells(Array(9).fill(null).map(() => Array(9).fill(false)));
    setIsWin(false);
    setTime(0);
    setIsTimerRunning(true);
    setSelectedCell(null);
  }, [difficulty]);

  useEffect(() => {
    generateNewGame();
  }, [difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning) {
      timer = setInterval(() => setTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const handleInputChange = (row: number, col: number, value: string) => {
    triggerHapticFeedback();
    if (initial[row][col] !== 0) return;

    const sanitizedValue = value.replace(/[^1-9]/g, '');
    const num = sanitizedValue ? parseInt(sanitizedValue, 10) : 0;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);

    const newIncorrectCells = incorrectCells.map(r => [...r]);
    const isNowIncorrect = num !== 0 && num !== solution[row][col];

    if (isNowIncorrect && !newIncorrectCells[row][col]) {
      setMistakes(m => m + 1);
    }
    newIncorrectCells[row][col] = isNowIncorrect;
    setIncorrectCells(newIncorrectCells);

    let isBoardFull = true;
    let isBoardCorrect = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (newBoard[i][j] === 0) isBoardFull = false;
        if (newBoard[i][j] !== solution[i][j]) isBoardCorrect = false;
      }
    }
    if (isBoardFull && isBoardCorrect) {
      setIsWin(true);
      setIsTimerRunning(false);
    }
  };

  const handleHint = () => {
    triggerHapticFeedback();
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (board[row][col] === 0) {
        handleInputChange(row, col, String(solution[row][col]));
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Sudoku</h1>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Difficulty:</span>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)} className="p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 w-full">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300 w-full justify-between sm:w-auto">
            <div className="text-lg">Time: {formatTime(time)}</div>
            <div className="text-lg text-red-500">Mistakes: {mistakes}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 bg-gray-400 dark:bg-gray-600 p-1 sm:p-2 rounded-lg w-full max-w-md aspect-square shadow-lg">
          {Array.from({ length: 9 }).map((_, blockIndex) => {
            const startRow = Math.floor(blockIndex / 3) * 3;
            const startCol = (blockIndex % 3) * 3;
            return (
              <div key={blockIndex} className="grid grid-cols-3 gap-1 bg-gray-300 dark:bg-gray-500 rounded-sm">
                {Array.from({ length: 9 }).map((_, cellIndex) => {
                  const rowIndex = startRow + Math.floor(cellIndex / 3);
                  const colIndex = startCol + (cellIndex % 3);
                  const cell = board[rowIndex][colIndex];
                  const isInitial = initial[rowIndex][colIndex] !== 0;
                  const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                  const isIncorrect = incorrectCells[rowIndex][colIndex];

                  return (
                    <input
                      key={`${rowIndex}-${colIndex}`}
                      type="tel"
                      maxLength={1}
                      value={cell === 0 ? '' : cell}
                      onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                      onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                      readOnly={isInitial}
                      className={`w-full aspect-square text-center font-bold text-xl sm:text-2xl transition-colors duration-200 rounded-sm ${isInitial ? 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 cursor-default' : `bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-300 focus:outline-none z-10 ${isSelected ? 'ring-2 ring-blue-500' : ''}`} ${isIncorrect ? '!text-red-500 !bg-red-200 dark:!bg-red-800/50' : ''}`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <button className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-semibold text-lg flex items-center gap-2" onClick={generateNewGame}>
            <RefreshCw size={20} /> New Game
          </button>
          <button className="px-5 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-md font-semibold text-lg flex items-center gap-2" onClick={handleHint}>
            <Lightbulb size={20} /> Hint
          </button>
        </div>

        {isWin && (
          <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-20">
            <CheckCircle className="text-green-400 w-24 h-24 mb-4" />
            <p className="text-5xl font-extrabold text-white">You Won!</p>
            <button onClick={generateNewGame} className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-lg">Play Again</button>
          </div>
        )}
      </div>
    </main>
  );
}
