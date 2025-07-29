'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

// --- Game Constants ---
const GRID_SIZE = 20;
const INITIAL_SPEED = 200;
const SPEED_INCREMENT = 5; // How much speed increases per food item

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

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
    
    // Use a ref to queue the next direction, making controls feel instant
    const nextDirectionRef = useRef<Direction>('RIGHT');

    // Load high score from local storage
    useEffect(() => {
        const storedHighScore = localStorage.getItem('snakeHighScore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    const createFood = (snakeBody: {x: number, y: number}[]) => {
        let newFoodPosition: { x: number; y: number; };
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
            const newHighScore = gameState.score;
            setHighScore(newHighScore);
            localStorage.setItem('snakeHighScore', String(newHighScore));
        }
        setGameState(getInitialState());
        nextDirectionRef.current = 'RIGHT';
    };
    
    const handleStartPause = () => {
        if (gameState.isGameOver) {
            resetGame();
        } else {
            setGameState(prev => ({...prev, isRunning: !prev.isRunning }));
        }
    };
    
    // --- Game Loop ---
    useEffect(() => {
        if (!gameState.isRunning || gameState.isGameOver) return;

        const gameInterval = setInterval(() => {
            setGameState(prev => {
                const currentDirection = prev.direction;
                const intendedDirection = nextDirectionRef.current;

                // --- Robust Anti-Reverse Logic ---
                // Check if the intended move is the opposite of the current move.
                const isReversing = (
                    (currentDirection === 'UP' && intendedDirection === 'DOWN') ||
                    (currentDirection === 'DOWN' && intendedDirection === 'UP') ||
                    (currentDirection === 'LEFT' && intendedDirection === 'RIGHT') ||
                    (currentDirection === 'RIGHT' && intendedDirection === 'LEFT')
                );
                
                const effectiveDirection = isReversing ? currentDirection : intendedDirection;

                const newSnake = [...prev.snake];
                const head = { ...newSnake[0] };

                switch (effectiveDirection) {
                    case 'UP': head.y -= 1; break;
                    case 'DOWN': head.y += 1; break;
                    case 'LEFT': head.x -= 1; break;
                    case 'RIGHT': head.x += 1; break;
                }

                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                    return {...prev, isGameOver: true, isRunning: false };
                }
                
                newSnake.unshift(head);

                let newFood = prev.food;
                let newScore = prev.score;
                let newSpeed = prev.speed;

                if (head.x === prev.food.x && head.y === prev.food.y) {
                    newScore += 10;
                    newSpeed = Math.max(50, prev.speed - SPEED_INCREMENT);
                    newFood = createFood(newSnake);
                } else {
                    newSnake.pop();
                }

                return {
                    ...prev,
                    snake: newSnake,
                    direction: effectiveDirection,
                    food: newFood,
                    score: newScore,
                    speed: newSpeed,
                };
            });
        }, gameState.speed);

        return () => clearInterval(gameInterval);
    }, [gameState.isRunning, gameState.isGameOver, gameState.speed]);


    // --- Controls ---
    const changeDirection = useCallback((newDirection: Direction) => {
        // Only update the ref. The game loop will handle the logic.
        // This makes the controls feel instantaneous.
        if (gameState.isRunning) {
           nextDirectionRef.current = newDirection;
        }
    }, [gameState.isRunning]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            let direction: Direction | null = null;
            switch (e.key) {
                case 'ArrowUp': direction = 'UP'; break;
                case 'ArrowDown': direction = 'DOWN'; break;
                case 'ArrowLeft': direction = 'LEFT'; break;
                case 'ArrowRight': direction = 'RIGHT'; break;
            }
            if(direction) {
                e.preventDefault(); // Prevent page scrolling
                changeDirection(direction);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [changeDirection]);

    const getRotation = (direction: Direction) => {
        if (direction === 'UP') return '-rotate-90';
        if (direction === 'DOWN') return 'rotate-90';
        if (direction === 'LEFT') return 'rotate-180';
        return 'rotate-0';
    }

    return (
        <div className="flex flex-col items-center justify-start px-4 pt-8 pb-4 bg-gray-50 dark:bg-gray-900 font-sans">
            <div className="relative w-full max-w-lg mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-lg font-semibold text-gray-800 dark:text-white shadow-md">Score: {gameState.score}</div>
                    <div className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-lg font-semibold text-gray-800 dark:text-white shadow-md">High Score: {highScore}</div>
                </div>

                <div className="relative bg-gray-200 dark:bg-gray-800 p-2 rounded-lg shadow-xl aspect-square">
                    <div className="grid grid-cols-20 grid-rows-20 gap-px w-full h-full">
                        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                            <div key={i} className={ (Math.floor(i / GRID_SIZE) + i % GRID_SIZE) % 2 === 0 ? 'bg-gray-300/50 dark:bg-gray-700/50' : 'bg-gray-300/80 dark:bg-gray-700/80'} />
                        ))}
                        <div className="absolute w-[5%] h-[5%] flex justify-center items-center animate-pulse" style={{ left: `${gameState.food.x * 5}%`, top: `${gameState.food.y * 5}%` }}>
                            <div className="w-full h-full rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                        </div>
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

            {/* --- On-Screen D-Pad for Mobile --- */}
            <div className="mt-6 lg:hidden">
                <div className="grid grid-cols-3 gap-3 w-48">
                    <div></div>
                    <button onClick={() => changeDirection('UP')} className="bg-slate-700/80 rounded-lg p-4 flex items-center justify-center text-white active:bg-slate-600"><ArrowUp size={24} /></button>
                    <div></div>
                    <button onClick={() => changeDirection('LEFT')} className="bg-slate-700/80 rounded-lg p-4 flex items-center justify-center text-white active:bg-slate-600"><ArrowLeft size={24} /></button>
                    <button onClick={() => changeDirection('DOWN')} className="bg-slate-700/80 rounded-lg p-4 flex items-center justify-center text-white active:bg-slate-600"><ArrowDown size={24} /></button>
                    <button onClick={() => changeDirection('RIGHT')} className="bg-slate-700/80 rounded-lg p-4 flex items-center justify-center text-white active:bg-slate-600"><ArrowRight size={24} /></button>
                </div>
            </div>

             <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Use arrow keys or on-screen buttons to move.</p>
        </div>
    );
};

export default SnakeGamePage;

