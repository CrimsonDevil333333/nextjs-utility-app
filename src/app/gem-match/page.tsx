'use client';

import { useState, useEffect, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { RefreshCw, Star, Clock, Move } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Game Constants and Types ---
const GRID_SIZE = 8;
const GEM_TYPES = ['🍓', '🍏', '🌰', '🍇', '💎', '⭐'];

interface Gem {
    id: number;
    type: string;
}

type GameMode = 'timed' | 'moves';

let nextId = 0;

const GemMatchGame = () => {
    const [board, setBoard] = useState<Gem[][]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [movesLeft, setMovesLeft] = useState(30);
    const [isGameOver, setIsGameOver] = useState(false);
    const [selectedGem, setSelectedGem] = useState<{ r: number, c: number } | null>(null);
    const [gameMode, setGameMode] = useState<GameMode>('timed');
    const [isBoardLocked, setIsBoardLocked] = useState(false);

    const createBoard = useCallback(() => {
        const newBoard = Array.from({ length: GRID_SIZE }, (_, r) =>
            Array.from({ length: GRID_SIZE }, (_, c) => ({
                id: nextId++,
                type: GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)],
            }))
        );
        setBoard(newBoard);
    }, []);

    const resetGame = useCallback(() => {
        triggerHapticFeedback();
        nextId = 0;
        createBoard();
        setScore(0);
        setTimeLeft(60);
        setMovesLeft(30);
        setIsGameOver(false);
        setIsBoardLocked(false);
    }, [createBoard]);

    useEffect(() => {
        resetGame();
    }, [resetGame, gameMode]);

    useEffect(() => {
        if (gameMode === 'timed' && timeLeft > 0 && !isGameOver && !isBoardLocked) {
            const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isGameOver) {
            setIsGameOver(true);
        }
    }, [timeLeft, isGameOver, gameMode, isBoardLocked]);

    const handleGemClick = (r: number, c: number) => {
        if (isGameOver || isBoardLocked) return;
        triggerHapticFeedback();

        if (selectedGem) {
            const { r: sr, c: sc } = selectedGem;
            if (Math.abs(sr - r) + Math.abs(sc - c) === 1) {
                setIsBoardLocked(true);
                const newBoard = board.map(row => [...row]);
                [newBoard[sr][sc], newBoard[r][c]] = [newBoard[r][c], newBoard[sr][sc]];
                setBoard(newBoard);

                setTimeout(() => {
                    const { matches } = findMatches(newBoard);
                    if (matches.length > 0) {
                        if (gameMode === 'moves') setMovesLeft(m => m - 1);
                        handleMatches(newBoard, matches);
                    } else {
                        setBoard(board); // Swap back
                        setTimeout(() => setIsBoardLocked(false), 200);
                    }
                }, 200);
            }
            setSelectedGem(null);
        } else {
            setSelectedGem({ r, c });
        }
    };

    const findMatches = (currentBoard: Gem[][]) => {
        const matches = new Set<string>();
        // Horizontal
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE - 2; c++) {
                if (currentBoard[r][c]?.type && currentBoard[r][c].type === currentBoard[r][c + 1].type && currentBoard[r][c].type === currentBoard[r][c + 2].type) {
                    matches.add(`${r}-${c}`);
                    matches.add(`${r}-${c + 1}`);
                    matches.add(`${r}-${c + 2}`);
                }
            }
        }
        // Vertical
        for (let c = 0; c < GRID_SIZE; c++) {
            for (let r = 0; r < GRID_SIZE - 2; r++) {
                if (currentBoard[r][c]?.type && currentBoard[r][c].type === currentBoard[r + 1][c].type && currentBoard[r][c].type === currentBoard[r + 2][c].type) {
                    matches.add(`${r}-${c}`);
                    matches.add(`${r + 1}-${c}`);
                    matches.add(`${r + 2}-${c}`);
                }
            }
        }
        return { matches: Array.from(matches).map(s => ({ r: parseInt(s.split('-')[0]), c: parseInt(s.split('-')[1]) })) };
    };

    const handleMatches = (currentBoard: Gem[][], matches: { r: number, c: number }[]) => {
        let newBoard = currentBoard.map(row => [...row]);
        setScore(s => s + matches.length * 10);

        matches.forEach(({ r, c }) => {
            newBoard[r][c] = { ...newBoard[r][c], type: '' };
        });
        setBoard(newBoard);

        setTimeout(() => {
            for (let c = 0; c < GRID_SIZE; c++) {
                let emptyRow = GRID_SIZE - 1;
                for (let r = GRID_SIZE - 1; r >= 0; r--) {
                    if (newBoard[r][c].type !== '') {
                        if (r !== emptyRow) {
                            [newBoard[emptyRow][c], newBoard[r][c]] = [newBoard[r][c], newBoard[emptyRow][c]];
                        }
                        emptyRow--;
                    }
                }
                for (let r = emptyRow; r >= 0; r--) {
                    newBoard[r][c] = { id: nextId++, type: GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)] };
                }
            }
            setBoard(newBoard);

            setTimeout(() => {
                const { matches: newMatches } = findMatches(newBoard);
                if (newMatches.length > 0) {
                    handleMatches(newBoard, newMatches);
                } else {
                    setIsBoardLocked(false);
                    if (gameMode === 'moves' && movesLeft - 1 <= 0) {
                        setIsGameOver(true);
                    }
                }
            }, 300);
        }, 300);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-4">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Gem Match</h1>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-center mb-4">
                        <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
                            <button onClick={() => { setGameMode('timed'); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${gameMode === 'timed' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Timed</button>
                            <button onClick={() => { setGameMode('moves'); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${gameMode === 'moves' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Moves</button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2"><Star size={20} /> Score: {score}</div>
                        {gameMode === 'timed' ? (
                            <div className="flex items-center gap-2"><Clock size={20} /> Time: {timeLeft}</div>
                        ) : (
                            <div className="flex items-center gap-2"><Move size={20} /> Moves: {movesLeft}</div>
                        )}
                    </div>

                    <div className="relative aspect-square bg-gray-200 dark:bg-gray-700 p-2 rounded-lg">
                        <div className="grid grid-cols-8 gap-1">
                            {board.map((row, r) => row.map((gem, c) => {
                                const isSelected = selectedGem?.r === r && selectedGem?.c === c;
                                return (
                                    <motion.div
                                        key={gem.id}
                                        layout
                                        className="w-full aspect-square flex items-center justify-center"
                                        onClick={() => handleGemClick(r, c)}
                                        animate={{ scale: gem.type ? 1 : 0.5, opacity: gem.type ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={`w-full h-full rounded-full transition-all duration-200 text-3xl flex items-center justify-center ${isSelected ? 'scale-110 ring-2 ring-white' : ''}`}>
                                            {gem.type}
                                        </div>
                                    </motion.div>
                                );
                            }))}
                        </div>
                        {isGameOver && (
                            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center rounded-lg">
                                <p className="text-3xl font-bold text-white">Game Over!</p>
                                <p className="text-xl text-white mt-2">Final Score: {score}</p>
                                <button onClick={resetGame} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">Play Again</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GemMatchGame;
