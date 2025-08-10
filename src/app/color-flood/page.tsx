'use client';

import { useState, useEffect, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { RefreshCw, CheckCircle, XCircle, HelpCircle, X } from 'lucide-react';

// --- Game Constants and Types ---
const GRID_SIZE = 10;
const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981']; // Blue, Red, Amber, Emerald

const ColorFloodGame = () => {
    const [board, setBoard] = useState<number[][]>([]);
    const [movesLeft, setMovesLeft] = useState(15);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
    const [showInstructions, setShowInstructions] = useState(false);

    const generateBoard = useCallback(() => {
        triggerHapticFeedback();
        const newBoard = Array.from({ length: GRID_SIZE }, () =>
            Array.from({ length: GRID_SIZE }, () => Math.floor(Math.random() * COLORS.length))
        );
        setBoard(newBoard);
        setMovesLeft(15 + level * 2);
        setGameStatus('playing');
    }, [level]);

    useEffect(() => {
        generateBoard();
    }, [generateBoard]);

    const floodFill = (newBoard: number[][], r: number, c: number, targetColor: number, newColor: number) => {
        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE || newBoard[r][c] !== targetColor || newBoard[r][c] === newColor) {
            return;
        }
        newBoard[r][c] = newColor;
        floodFill(newBoard, r + 1, c, targetColor, newColor);
        floodFill(newBoard, r - 1, c, targetColor, newColor);
        floodFill(newBoard, r, c + 1, targetColor, newColor);
        floodFill(newBoard, r, c - 1, targetColor, newColor);
    };

    const handleColorSelect = (newColor: number) => {
        if (gameStatus !== 'playing' || movesLeft === 0) return;
        triggerHapticFeedback();

        const newBoard = board.map(row => [...row]);
        const startColor = newBoard[0][0];

        if (startColor !== newColor) {
            floodFill(newBoard, 0, 0, startColor, newColor);
            setBoard(newBoard);
            setMovesLeft(prev => prev - 1);

            const isWin = newBoard.flat().every(cell => cell === newColor);
            if (isWin) {
                setScore(s => s + movesLeft * 10);
                setLevel(l => l + 1);
                setGameStatus('won');
            } else if (movesLeft - 1 === 0) {
                setGameStatus('lost');
            }
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-lg mx-auto">
                <div className="text-center mb-4 relative">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Color Flood</h1>
                    <button onClick={() => { setShowInstructions(true); triggerHapticFeedback(); }} className="absolute top-0 right-0 p-2 text-gray-500 hover:text-blue-500"><HelpCircle /></button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <div>Score: {score}</div>
                        <div>Level: {level}</div>
                        <div>Moves Left: {movesLeft}</div>
                    </div>

                    <div className="relative aspect-square bg-gray-200 dark:bg-gray-700 p-2 rounded-lg">
                        <div className="grid grid-cols-10 gap-1">
                            {board.flat().map((colorIndex, i) => (
                                <div key={i} className="w-full aspect-square rounded-sm transition-colors duration-300" style={{ backgroundColor: COLORS[colorIndex] }}></div>
                            ))}
                        </div>
                        {gameStatus !== 'playing' && (
                            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center rounded-lg">
                                {gameStatus === 'won' && <CheckCircle className="w-16 h-16 text-green-400 mb-4" />}
                                {gameStatus === 'lost' && <XCircle className="w-16 h-16 text-red-400 mb-4" />}
                                <p className="text-3xl font-bold text-white">{gameStatus === 'won' ? 'You Won!' : 'Game Over'}</p>
                                <button onClick={generateBoard} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">
                                    {gameStatus === 'won' ? 'Next Level' : 'Play Again'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-center gap-4">
                        {COLORS.map((color, index) => (
                            <button
                                key={index}
                                onClick={() => handleColorSelect(index)}
                                className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-600 shadow-lg transform hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>

            {showInstructions && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowInstructions(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">How to Play</h2>
                            <button onClick={() => { setShowInstructions(false); triggerHapticFeedback(); }}><X /></button>
                        </div>
                        <p className="mb-2">The goal is to flood the entire board with a single color.</p>
                        <p className="mb-2">Start from the top-left corner and select a color from the bottom to change the color of the flooded area.</p>
                        <p>You have a limited number of moves to complete each level.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorFloodGame;
