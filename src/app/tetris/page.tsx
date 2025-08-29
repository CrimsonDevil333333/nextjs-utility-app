'use client';

import { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw, Play, Pause } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Game Constants ---
const COLS = 10;
const ROWS = 20;
const SHAPES = {
    'I': { shape: [[1, 1, 1, 1]], color: 'bg-cyan-400 shadow-cyan-300/50' },
    'J': { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500 shadow-blue-400/50' },
    'L': { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500 shadow-orange-400/50' },
    'O': { shape: [[1, 1], [1, 1]], color: 'bg-yellow-400 shadow-yellow-300/50' },
    'S': { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500 shadow-green-400/50' },
    'T': { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500 shadow-purple-400/50' },
    'Z': { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500 shadow-red-400/50' }
};
type ShapeKeys = keyof typeof SHAPES;
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Piece = {
    shape: number[][];
    color: string;
    x: number;
    y: number;
}

// --- Main Component ---
const TetrisPage = () => {
    const createEmptyBoard = (): (string | null)[][] => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

    const [board, setBoard] = useState(createEmptyBoard());
    const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
    const [nextPiece, setNextPiece] = useState<Piece | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [touchStart, setTouchStart] = useState<{ x: number, y: number, time: number } | null>(null);
    const [lastMove, setLastMove] = useState(0);

    const nextDirectionRef = useRef<Direction>('RIGHT');

    const getRandomPiece = useCallback((): Piece => {
        const keys = Object.keys(SHAPES) as ShapeKeys[];
        const randKey = keys[Math.floor(Math.random() * keys.length)];
        return { ...SHAPES[randKey], x: Math.floor(COLS / 2) - 1, y: 0 };
    }, []);

    const resetGame = useCallback(() => {
        triggerHapticFeedback();
        setBoard(createEmptyBoard());
        setCurrentPiece(getRandomPiece());
        setNextPiece(getRandomPiece());
        setScore(0);
        setLevel(1);
        setIsGameOver(false);
        setIsRunning(false);
        nextDirectionRef.current = 'RIGHT';
    }, [getRandomPiece]);

    useEffect(() => { resetGame(); }, [resetGame]);

    const isValidMove = (piece: Piece, board: (string | null)[][]): boolean => {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const newY = piece.y + y;
                    const newX = piece.x + x;
                    if (newY >= ROWS || newX < 0 || newX >= COLS || (board[newY] && board[newY][newX])) return false;
                }
            }
        }
        return true;
    };

    const dropPiece = useCallback(() => {
        setCurrentPiece(prevPiece => {
            if (!prevPiece || isGameOver) return prevPiece;

            const newPiece = { ...prevPiece, y: prevPiece.y + 1 };
            if (isValidMove(newPiece, board)) {
                return newPiece;
            } else {
                setBoard(prevBoard => {
                    const newBoard = prevBoard.map(row => [...row]);
                    prevPiece.shape.forEach((row, y) => {
                        row.forEach((value, x) => {
                            if (value) newBoard[prevPiece.y + y][prevPiece.x + x] = prevPiece.color;
                        });
                    });

                    let linesCleared = 0;
                    for (let y = newBoard.length - 1; y >= 0; y--) {
                        if (newBoard[y].every(cell => cell !== null)) {
                            newBoard.splice(y, 1);
                            newBoard.unshift(Array(COLS).fill(null));
                            linesCleared++;
                            y++;
                        }
                    }
                    if (linesCleared > 0) {
                        setScore(s => {
                            const newScore = s + [0, 100, 300, 500, 800][linesCleared] * linesCleared;
                            setLevel(Math.floor(newScore / 500) + 1);
                            return newScore;
                        });
                    }

                    if (nextPiece && !isValidMove(nextPiece, newBoard)) {
                        setIsGameOver(true);
                        setIsRunning(false);
                    }

                    return newBoard;
                });

                if (nextPiece && isValidMove(nextPiece, board)) {
                    setNextPiece(getRandomPiece());
                    return nextPiece;
                }
                return null;
            }
        });
    }, [board, isGameOver, nextPiece, getRandomPiece]);

    useEffect(() => {
        if (!isRunning || isGameOver) return;
        const gameSpeed = Math.max(100, 800 - (level * 50));
        const gameInterval = setInterval(dropPiece, gameSpeed);
        return () => clearInterval(gameInterval);
    }, [isRunning, isGameOver, level, dropPiece]);

    const movePiece = (dx: number) => {
        if (!currentPiece || isGameOver || !isRunning) return;
        const newPiece = { ...currentPiece, x: currentPiece.x + dx };
        if (isValidMove(newPiece, board)) {
            setCurrentPiece(newPiece);
            triggerHapticFeedback();
        }
    };

    const rotatePiece = () => {
        if (!currentPiece || isGameOver || !isRunning) return;
        const newShape = currentPiece.shape[0].map((_, colIndex) => currentPiece.shape.map(row => row[colIndex]).reverse());
        const newPiece = { ...currentPiece, shape: newShape };
        if (isValidMove(newPiece, board)) {
            setCurrentPiece(newPiece);
            triggerHapticFeedback();
        }
    };

    const hardDrop = () => {
        if (!currentPiece || isGameOver || !isRunning) return;
        const tempPiece = { ...currentPiece };
        while (isValidMove({ ...tempPiece, y: tempPiece.y + 1 }, board)) {
            tempPiece.y += 1;
        }
        setCurrentPiece(tempPiece);
        triggerHapticFeedback();
    };

    const handleStartPause = () => {
        triggerHapticFeedback();
        if (isGameOver) {
            resetGame();
        } else {
            setIsRunning(prev => !prev);
        }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === ' ') {
            e.preventDefault();
            hardDrop();
            return;
        }

        if (isGameOver) return;

        switch (e.key) {
            case 'ArrowLeft': movePiece(-1); break;
            case 'ArrowRight': movePiece(1); break;
            case 'ArrowDown': dropPiece(); break;
            case 'ArrowUp': rotatePiece(); break;
        }
    }, [isGameOver, dropPiece, hardDrop, rotatePiece]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY, time: Date.now() });
    };

    const handleTouchEnd = (e: TouchEvent) => {
        if (!touchStart) return;
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;
        const deltaTime = Date.now() - touchStart.time;

        if (deltaTime < 250 && Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) {
            rotatePiece();
        } else if (Math.abs(deltaX) < Math.abs(deltaY)) {
            if (deltaY < -40) {
                hardDrop();
            } else if (deltaY > 40) {
                dropPiece();
            }
        }
        setTouchStart(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!touchStart || Date.now() - lastMove < 100) return;
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStart.x;
        if (Math.abs(deltaX) > 30) {
            movePiece(deltaX > 0 ? 1 : -1);
            setTouchStart({ ...touchStart, x: touch.clientX });
            setLastMove(Date.now());
        }
    };

    const displayBoard = board.map(row => [...row]);
    if (currentPiece) {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) displayBoard[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
            });
        });
    }

    return (
        <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-4">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Tetris 🧱</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                    <div
                        className="relative bg-slate-800/80 dark:bg-black/80 backdrop-blur-sm p-2 rounded-lg shadow-2xl border border-slate-700/50"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 lg:hidden px-4 py-1 bg-black/30 rounded-full text-white font-semibold text-lg">
                            SCORE: {score}
                        </div>
                        <div className="grid grid-cols-10 gap-px">
                            {displayBoard.map((row, y) =>
                                row.map((cell, x) => (
                                    <div key={`${y}-${x}`} className="w-6 h-6 sm:w-7 sm:h-7">
                                        <div className={`w-full h-full rounded-[2px] ${cell ? `${cell} shadow-lg` : 'bg-slate-900/50'}`} />
                                    </div>
                                ))
                            )}
                        </div>
                        {isGameOver && (
                            <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center rounded-lg">
                                <p className="text-4xl font-extrabold text-white">Game Over</p>
                                <button onClick={resetGame} className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Play Again</button>
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-48 space-y-4">
                        <div className="hidden lg:block bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center border border-slate-200 dark:border-slate-700/50">
                            <h2 className="font-bold text-lg text-gray-700 dark:text-gray-300">SCORE</h2>
                            <p className="text-3xl font-mono font-bold text-gray-900 dark:text-white">{score}</p>
                        </div>
                        <div className="hidden lg:block bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center border border-slate-200 dark:border-slate-700/50">
                            <h2 className="font-bold text-lg text-gray-700 dark:text-gray-300">LEVEL</h2>
                            <p className="text-3xl font-mono font-bold text-gray-900 dark:text-white">{level}</p>
                        </div>
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center border border-slate-200 dark:border-slate-700/50">
                            <h2 className="font-bold text-lg text-gray-700 dark:text-gray-300">NEXT</h2>
                            <div className="flex justify-center items-center h-20">
                                {nextPiece && (
                                    <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1fr)` }}>
                                        {nextPiece.shape.map((row, y) => row.map((cell, x) => (
                                            <div key={`${y}-${x}`} className={`w-5 h-5 ${cell ? `${nextPiece.color} rounded-[1px]` : ''}`} />
                                        )))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button onClick={handleStartPause} className="w-full py-3 bg-blue-500/90 text-white font-semibold rounded-lg hover:bg-blue-600 transition shadow-lg flex items-center justify-center gap-2">
                            {isRunning ? <Pause /> : <Play />} {isRunning ? 'Pause' : 'Play'}
                        </button>
                        <button onClick={resetGame} className="w-full py-3 bg-red-500/90 text-white font-semibold rounded-lg hover:bg-red-600 transition shadow-lg">Reset</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TetrisPage;
