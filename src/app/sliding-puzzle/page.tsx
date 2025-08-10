'use client';

import { useState, useEffect, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Game Constants and Types ---
const GRID_SIZE = 4;

const SlidingPuzzlePage = () => {
    const [tiles, setTiles] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [time, setTime] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const createSolvedBoard = () => [...Array.from({ length: GRID_SIZE * GRID_SIZE - 1 }, (_, i) => i + 1), 0];

    const isSolvable = (arr: number[]): boolean => {
        let inversions = 0;
        const flatArr = arr.filter(t => t !== 0);
        for (let i = 0; i < flatArr.length - 1; i++) {
            for (let j = i + 1; j < flatArr.length; j++) {
                if (flatArr[i] > flatArr[j]) {
                    inversions++;
                }
            }
        }
        const emptyRow = Math.floor(arr.indexOf(0) / GRID_SIZE);
        if (GRID_SIZE % 2 !== 0) {
            return inversions % 2 === 0;
        } else {
            return (inversions + emptyRow) % 2 !== 0;
        }
    };

    const shuffleBoard = useCallback(() => {
        let newTiles: number[];
        do {
            newTiles = createSolvedBoard().sort(() => Math.random() - 0.5);
        } while (!isSolvable(newTiles));
        setTiles(newTiles);
    }, []);

    const resetGame = useCallback(() => {
        triggerHapticFeedback();
        shuffleBoard();
        setMoves(0);
        setTime(0);
        setIsSolved(false);
        setIsTimerRunning(false);
    }, [shuffleBoard]);

    useEffect(() => {
        resetGame();
    }, [resetGame]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isTimerRunning && !isSolved) {
            timer = setInterval(() => setTime(t => t + 1), 1000);
        }
        return () => clearInterval(timer);
    }, [isTimerRunning, isSolved]);

    const handleTileClick = (index: number) => {
        if (isSolved) return;
        triggerHapticFeedback();
        if (!isTimerRunning) setIsTimerRunning(true);

        const emptyIndex = tiles.indexOf(0);
        const { row: tileRow, col: tileCol } = { row: Math.floor(index / GRID_SIZE), col: index % GRID_SIZE };
        const { row: emptyRow, col: emptyCol } = { row: Math.floor(emptyIndex / GRID_SIZE), col: emptyIndex % GRID_SIZE };

        if ((tileRow === emptyRow && Math.abs(tileCol - emptyCol) === 1) || (tileCol === emptyCol && Math.abs(tileRow - emptyRow) === 1)) {
            const newTiles = [...tiles];
            [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
            setTiles(newTiles);
            setMoves(m => m + 1);

            if (newTiles.every((t, i) => t === (i + 1) % (GRID_SIZE * GRID_SIZE))) {
                setIsSolved(true);
                setIsTimerRunning(false);
            }
        }
    };

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-4">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Sliding Puzzle</h1>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <div>Moves: {moves}</div>
                        <div>Time: {formatTime(time)}</div>
                    </div>

                    <div className="relative aspect-square bg-gray-300 dark:bg-gray-700 p-2 rounded-lg">
                        <AnimatePresence>
                            <div className="grid grid-cols-4 gap-2">
                                {tiles.map((tile, index) => (
                                    <motion.div
                                        key={tile}
                                        layout
                                        onClick={() => handleTileClick(index)}
                                        className={`w-full aspect-square rounded-md flex items-center justify-center text-2xl font-bold transition-colors ${tile === 0 ? 'bg-transparent' : 'bg-blue-500 text-white cursor-pointer'}`}
                                    >
                                        {tile !== 0 && tile}
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatePresence>
                        {isSolved && (
                            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center rounded-lg">
                                <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                                <p className="text-3xl font-bold text-white">You Won!</p>
                                <button onClick={resetGame} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">Play Again</button>
                            </div>
                        )}
                    </div>
                    <button onClick={resetGame} className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        <RefreshCw size={20} /> New Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlidingPuzzlePage;
