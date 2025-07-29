'use client';

import { useState, useEffect, useCallback } from 'react';

// --- Game Constants ---
const GRID_SIZE = 20;
const INITIAL_SPEED = 200;
const SPEED_INCREMENT = 5; // How much speed increases per food item

const SnakeGamePage = () => {
    // --- State Management ---
    const getInitialState = () => ({
        snake: [{ x: 10, y: 10 }],
        food: { x: 15, y: 15 },
        direction: 'RIGHT' as Direction,
        speed: INITIAL_SPEED,
        isGameOver: false,
        isRunning: false,
        score: 0,
    });

    const [gameState, setGameState] = useState(getInitialState());
    const [highScore, setHighScore] = useState(0);
    const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);

    // Load high score from local storage
    useEffect(() => {
        const storedHighScore = localStorage.getItem('snakeHighScore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    const createFood = (snakeBody: {x: number, y: number}[]) => {
        let newFoodPosition: { x: any; y: any; };
        do {
            newFoodPosition = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
        } while (snakeBody.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
        return newFoodPosition;
    };

    const resetGame = () => {
        if (gameState.score > highScore) {
            setHighScore(gameState.score);
            localStorage.setItem('snakeHighScore', String(gameState.score));
        }
        setGameState(getInitialState());
    };
    
    const handleStartPause = () => {
        if (gameState.isGameOver) {
            resetGame();
        } else {
            setGameState(prev => ({...prev, isRunning: !prev.isRunning }));
        }
    };
    
    // --- Game Loop ---
    const runGame = useCallback(() => {
        if (!gameState.isRunning || gameState.isGameOver) return;

        const newSnake = [...gameState.snake];
        const head = { ...newSnake[0] };

        switch (gameState.direction) {
            case 'UP': head.y -= 1; break;
            case 'DOWN': head.y += 1; break;
            case 'LEFT': head.x -= 1; break;
            case 'RIGHT': head.x += 1; break;
        }

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE ||
            // Self collision
            newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
            setGameState(prev => ({...prev, isGameOver: true, isRunning: false }));
            return;
        }
        
        newSnake.unshift(head);

        // Food collision
        if (head.x === gameState.food.x && head.y === gameState.food.y) {
            setGameState(prev => ({
                ...prev,
                score: prev.score + 10,
                speed: Math.max(50, prev.speed - SPEED_INCREMENT),
                food: createFood(newSnake)
            }));
        } else {
            newSnake.pop();
        }
        setGameState(prev => ({...prev, snake: newSnake}));
    }, [gameState]);

    useEffect(() => {
        const gameInterval = setInterval(runGame, gameState.speed);
        return () => clearInterval(gameInterval);
    }, [runGame, gameState.speed]);


    // --- Controls (Keyboard & Swipe) ---
    const changeDirection = useCallback((newDirection: Direction) => {
        const { direction } = gameState;
        if (
            (direction === 'UP' && newDirection === 'DOWN') ||
            (direction === 'DOWN' && newDirection === 'UP') ||
            (direction === 'LEFT' && newDirection === 'RIGHT') ||
            (direction === 'RIGHT' && newDirection === 'LEFT')
        ) {
            return; // Prevent reversing
        }
        setGameState(prev => ({...prev, direction: newDirection }));
    }, [gameState]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp': changeDirection('UP'); break;
                case 'ArrowDown': changeDirection('DOWN'); break;
                case 'ArrowLeft': changeDirection('LEFT'); break;
                case 'ArrowRight': changeDirection('RIGHT'); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [changeDirection]);

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart) return;
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            changeDirection(deltaX > 0 ? 'RIGHT' : 'LEFT');
        } else {
            changeDirection(deltaY > 0 ? 'DOWN' : 'UP');
        }
        setTouchStart(null);
    };

    type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
    const getRotation = (direction: Direction) => {
        if (direction === 'UP') return '-rotate-90';
        if (direction === 'DOWN') return 'rotate-90';
        if (direction === 'LEFT') return 'rotate-180';
        return 'rotate-0';
    }

    return (
        <div className="flex flex-col items-center justify-start px-4 pt-8 pb-4 bg-gray-50 dark:bg-gray-900 font-sans">
            <div className="relative w-full max-w-lg mx-auto">
                {/* Score Pills */}
                <div className="flex justify-between items-center mb-4">
                    <div className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-lg font-semibold text-gray-800 dark:text-white shadow-md">Score: {gameState.score}</div>
                    <div className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-lg font-semibold text-gray-800 dark:text-white shadow-md">High Score: {highScore}</div>
                </div>

                {/* Game Board */}
                <div 
                    className="relative bg-gray-200 dark:bg-gray-800 p-2 rounded-lg shadow-xl aspect-square"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="grid grid-cols-20 grid-rows-20 gap-px w-full h-full">
                        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                            <div key={i} className={ (Math.floor(i / GRID_SIZE) + i % GRID_SIZE) % 2 === 0 ? 'bg-gray-300/50 dark:bg-gray-700/50' : 'bg-gray-300/80 dark:bg-gray-700/80'} />
                        ))}
                        {/* Food */}
                        <div className="absolute w-[5%] h-[5%] flex justify-center items-center animate-pulse" style={{ left: `${gameState.food.x * 5}%`, top: `${gameState.food.y * 5}%` }}>
                            <div className="w-full h-full rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                        </div>
                        {/* Snake */}
                        {gameState.snake.map((segment, index) => (
                            <div key={index} className={`absolute w-[5%] h-[5%] rounded-sm transition-all duration-75 ${index === 0 ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-green-500 to-green-700'}`} style={{ left: `${segment.x * 5}%`, top: `${segment.y * 5}%` }}>
                                {index === 0 && (
                                    <div className={`w-full h-full flex items-center justify-center transform ${getRotation(gameState.direction)}`}>
                                        <div className="flex w-1/2 justify-between">
                                            <div className="w-1/4 h-1/4 bg-black rounded-full" />
                                            <div className="w-1/4 h-1/4 bg-black rounded-full" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Overlay */}
                    {(!gameState.isRunning || gameState.isGameOver) && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-center items-center rounded-lg">
                            {gameState.isGameOver && <p className="text-4xl font-extrabold text-white">Game Over</p>}
                            <button onClick={handleStartPause} className="mt-4 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-xl shadow-lg">
                                {gameState.isGameOver ? 'Play Again' : gameState.isRunning ? 'Pause' : 'Start Game'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
             <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Use swipe or arrow keys to move.</p>
        </div>
    );
};

export default SnakeGamePage;