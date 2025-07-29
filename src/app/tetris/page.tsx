'use client';

import { useState, useEffect, useCallback, TouchEvent } from 'react';

// --- Constants and Types ---
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
type Piece = {
    shape: number[][];
    color: string;
    x: number;
    y: number;
}

// --- Main Component ---
const TetrisPage = () => {
    // --- State Management ---
    const createEmptyBoard = (): (string | null)[][] => Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    
    const [board, setBoard] = useState(createEmptyBoard());
    const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
    const [nextPiece, setNextPiece] = useState<Piece | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [touchStart, setTouchStart] = useState<{ x: number, y: number, time: number } | null>(null);
    const [lastMove, setLastMove] = useState(0);

    // --- Game Logic ---
    const getRandomPiece = useCallback((): Piece => {
        const keys = Object.keys(SHAPES) as ShapeKeys[];
        const randKey = keys[Math.floor(Math.random() * keys.length)];
        return { ...SHAPES[randKey], x: Math.floor(COLS / 2) - 1, y: 0 };
    }, []);

    const resetGame = useCallback(() => {
        setBoard(createEmptyBoard());
        setCurrentPiece(getRandomPiece());
        setNextPiece(getRandomPiece());
        setScore(0);
        setIsGameOver(false);
    }, [getRandomPiece]);

    useEffect(() => { resetGame(); }, [resetGame]);

    const isValidMove = (piece: Piece, board: (string|null)[][]): boolean => {
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
        if (!currentPiece || isGameOver) return;
        
        const newPiece = { ...currentPiece, y: currentPiece.y + 1 };
        if (isValidMove(newPiece, board)) {
            setCurrentPiece(newPiece);
        } else {
            const newBoard = board.map(row => [...row]);
            currentPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) newBoard[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
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
            if (linesCleared > 0) setScore(s => s + [0, 100, 300, 500, 800][linesCleared] * linesCleared);

            setBoard(newBoard);
            
            if (nextPiece) {
                if (!isValidMove(nextPiece, newBoard)) {
                    setIsGameOver(true);
                    setCurrentPiece(null);
                } else {
                    setCurrentPiece(nextPiece);
                    setNextPiece(getRandomPiece());
                }
            }
        }
    }, [board, currentPiece, isGameOver, nextPiece, getRandomPiece]);

    useEffect(() => {
        if (isGameOver) return;
        const gameInterval = setInterval(dropPiece, 800);
        return () => clearInterval(gameInterval);
    }, [dropPiece, isGameOver]);
    
    // --- Player Actions ---
    const movePiece = (dx: number) => {
        if (!currentPiece || isGameOver) return;
        const newPiece = { ...currentPiece, x: currentPiece.x + dx };
        if (isValidMove(newPiece, board)) setCurrentPiece(newPiece);
    };

    const rotatePiece = () => {
        if (!currentPiece || isGameOver) return;
        const newShape = currentPiece.shape[0].map((_, colIndex) => currentPiece.shape.map(row => row[colIndex]).reverse());
        const newPiece = { ...currentPiece, shape: newShape };
        if (isValidMove(newPiece, board)) setCurrentPiece(newPiece);
    };
    
    const hardDrop = () => {
        if (!currentPiece || isGameOver) return;
        const tempPiece = { ...currentPiece };
        while (isValidMove({ ...tempPiece, y: tempPiece.y + 1 }, board)) {
            tempPiece.y += 1;
        }
        setCurrentPiece(tempPiece);
    };

    // --- Controls (Keyboard & Swipe) ---
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (isGameOver) return;
        e.preventDefault();
        switch (e.key) {
            case 'ArrowLeft': movePiece(-1); break;
            case 'ArrowRight': movePiece(1); break;
            case 'ArrowDown': dropPiece(); break;
            case 'ArrowUp': rotatePiece(); break;
            case ' ': hardDrop(); break;
        }
    }, [isGameOver, dropPiece]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    
    // Swipe Controls Logic
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
            rotatePiece(); // Tap to rotate
        } else if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe is handled in onTouchMove
        } else {
            if (deltaY < -40) { // Swipe Up for hard drop
                hardDrop();
            } else if (deltaY > 40) { // Swipe Down for soft drop
                dropPiece();
            }
        }
        setTouchStart(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!touchStart || Date.now() - lastMove < 100) return; // Throttle horizontal moves
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStart.x;

        if (Math.abs(deltaX) > 30) { // Swipe threshold
            movePiece(deltaX > 0 ? 1 : -1);
            setTouchStart({ ...touchStart, x: touch.clientX }); // Reset start X to allow continuous swiping
            setLastMove(Date.now());
        }
    };


    // --- Rendering ---
    const displayBoard = board.map(row => [...row]);
    if (currentPiece) {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) displayBoard[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
            });
        });
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen pt-8 sm:pt-4 p-4 bg-gray-50 dark:bg-gray-900 font-sans">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800 dark:text-white">Tetris 🧱</h1>
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                {/* Game Board with Touch Handlers and Score Pill */}
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

                {/* Desktop Side Panel */}
                <div className="w-full lg:w-48 space-y-4">
                    <div className="hidden lg:block bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center border border-slate-200 dark:border-slate-700/50">
                        <h2 className="font-bold text-lg text-gray-700 dark:text-gray-300">SCORE</h2>
                        <p className="text-3xl font-mono font-bold text-gray-900 dark:text-white">{score}</p>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center border border-slate-200 dark:border-slate-700/50">
                        <h2 className="font-bold text-lg text-gray-700 dark:text-gray-300">NEXT</h2>
                        <div className="flex justify-center items-center h-20">
                            {nextPiece && (
                                <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1fr)`}}>
                                {nextPiece.shape.map((row, y) => row.map((cell, x) => (
                                    <div key={`${y}-${x}`} className={`w-5 h-5 ${cell ? `${nextPiece.color} rounded-[1px]` : ''}`}/>
                                )))}
                                </div>
                            )}
                        </div>
                    </div>
                     <div className="hidden lg:block bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700/50">
                        <h2 className="font-bold text-lg text-gray-700 dark:text-gray-300 mb-2">CONTROLS</h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li><kbd className="font-mono bg-slate-200 dark:bg-slate-700 p-1 rounded">↑</kbd> - Rotate</li>
                            <li><kbd className="font-mono bg-slate-200 dark:bg-slate-700 p-1 rounded">←↓→</kbd> - Move</li>
                            <li><kbd className="font-mono bg-slate-200 dark:bg-slate-700 p-1 rounded">Space</kbd> - Hard Drop</li>
                        </ul>
                     </div>
                     <button onClick={resetGame} className="w-full py-3 bg-red-500/90 text-white font-semibold rounded-lg hover:bg-red-600 transition shadow-lg">Reset</button>
                </div>
            </div>
        </div>
    );
};

export default TetrisPage;