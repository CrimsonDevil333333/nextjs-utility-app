'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Game Constants ---
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 8;
const BRICK_ROWS = 6;
const BRICK_COLS = 10;
const BRICK_COLORS = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'];

// --- Types ---
interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  isAlive: boolean;
}

const BreakoutPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'paused' | 'over' | 'won'>('start');
  const [paddleX, setPaddleX] = useState(0);
  const [paddleWidth, setPaddleWidth] = useState(100);
  const [ball, setBall] = useState({ x: 0, y: 0, dx: 0, dy: 0 });
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);

  // --- Game Setup & Reset ---
  const resetLevel = useCallback((canvas: HTMLCanvasElement) => {
    // Make the paddle wider, especially on mobile, for easier play
    const newPaddleWidth = Math.max(80, canvas.width / 6);
    setPaddleWidth(newPaddleWidth);
    setPaddleX((canvas.width - newPaddleWidth) / 2);
    setBall({
      x: canvas.width / 2,
      y: canvas.height - PADDLE_HEIGHT - BALL_RADIUS - 5,
      // Slow down the initial ball speed to make the game less difficult at the start
      dx: 2 * (Math.random() > 0.5 ? 1 : -1),
      dy: -1
    });
  }, []);

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load high score
    const storedHighScore = localStorage.getItem('breakoutHighScore');
    if (storedHighScore) setHighScore(parseInt(storedHighScore, 10));

    // Create bricks
    const newBricks: Brick[] = [];
    const brickHeight = 25;
    const brickPadding = 2;
    const brickOffsetTop = 50;
    const brickOffsetLeft = 5;
    const brickWidth = (canvas.width - (brickOffsetLeft * 2)) / BRICK_COLS - brickPadding;

    for (let c = 0; c < BRICK_COLS; c++) {
      for (let r = 0; r < BRICK_ROWS; r++) {
        newBricks.push({
          x: c * (brickWidth + brickPadding) + brickOffsetLeft,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          width: brickWidth,
          height: brickHeight,
          color: BRICK_COLORS[r % BRICK_COLORS.length],
          isAlive: true,
        });
      }
    }
    setBricks(newBricks);
    setScore(0);
    setLives(3);
    setGameState('start');
    resetLevel(canvas);
  }, [resetLevel]);

  // Initialize and handle window resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 500;
      canvas.height = canvas.parentElement?.clientHeight || 500;
      resetGame();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resetGame]);

  // --- Game Loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw elements
      bricks.forEach(brick => {
        if (brick.isAlive) {
          ctx.beginPath();
          ctx.rect(brick.x, brick.y, brick.width, brick.height);
          ctx.fillStyle = brick.color;
          ctx.shadowColor = brick.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.closePath();
        }
      });
      ctx.shadowBlur = 0;

      ctx.beginPath();
      const paddleGradient = ctx.createLinearGradient(paddleX, 0, paddleX + paddleWidth, 0);
      paddleGradient.addColorStop(0, '#8e2de2');
      paddleGradient.addColorStop(1, '#4a00e0');
      ctx.fillStyle = paddleGradient;
      ctx.fillRect(paddleX, canvas.height - PADDLE_HEIGHT, paddleWidth, PADDLE_HEIGHT);
      ctx.closePath();

      ctx.beginPath();
      const ballGradient = ctx.createRadialGradient(ball.x, ball.y, BALL_RADIUS / 2, ball.x, ball.y, BALL_RADIUS);
      ballGradient.addColorStop(0, 'white');
      ballGradient.addColorStop(1, '#a2d2ff');
      ctx.fillStyle = ballGradient;
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      // Collision detection and state updates
      setBall(prevBall => {
        const newBall = { ...prevBall };

        // Wall collision
        if (newBall.x + newBall.dx > canvas.width - BALL_RADIUS || newBall.x + newBall.dx < BALL_RADIUS) newBall.dx = -newBall.dx;
        if (newBall.y + newBall.dy < BALL_RADIUS) newBall.dy = -newBall.dy;
        else if (newBall.y + newBall.dy > canvas.height - BALL_RADIUS) {
          if (newBall.x > paddleX && newBall.x < paddleX + paddleWidth) {
            newBall.dy = -newBall.dy;
          } else {
            setLives(l => l - 1);
            if (lives - 1 <= 0) {
              setGameState('over');
              if (score > highScore) localStorage.setItem('breakoutHighScore', score.toString());
            } else {
              resetLevel(canvas);
              setGameState('paused');
            }
            return prevBall; // Return old state before resetting position
          }
        }

        // Brick collision
        setBricks(prevBricks => {
          const newBricks = [...prevBricks];
          newBricks.forEach(brick => {
            if (brick.isAlive && newBall.x > brick.x && newBall.x < brick.x + brick.width && newBall.y > brick.y && newBall.y < brick.y + brick.height) {
              newBall.dy = -newBall.dy;
              brick.isAlive = false;
              setScore(s => s + 10);
            }
          });
          return newBricks;
        });

        if (bricks.every(b => !b.isAlive)) {
          setGameState('won');
          if (score > highScore) localStorage.setItem('breakoutHighScore', score.toString());
        }

        newBall.x += newBall.dx;
        newBall.y += newBall.dy;
        return newBall;
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [ball, bricks, gameState, lives, paddleX, paddleWidth, resetLevel, score, highScore]);

  // --- Controls ---
  const handlePointerMove = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas || gameState === 'start' || gameState === 'paused') return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const newPaddleX = relativeX - paddleWidth / 2;
    setPaddleX(Math.max(0, Math.min(canvas.width - paddleWidth, newPaddleX)));
  };

  const handlePlayPause = () => {
    if (gameState === 'start' || gameState === 'paused') setGameState('playing');
    else if (gameState === 'playing') setGameState('paused');
    else if (gameState === 'over' || gameState === 'won') resetGame();
    triggerHapticFeedback();
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handlePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);


  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 min-h-[calc(100dvh-4rem)] text-gray-800 dark:text-white font-sans">
      <h1 className="text-4xl font-bold mb-2">Breakout 🧱</h1>
      <div className="flex justify-between w-full max-w-2xl mb-4 text-lg">
        <span className="px-3 py-1 bg-white/10 dark:bg-black/20 rounded-full">Score: {score}</span>
        <span className="px-3 py-1 bg-white/10 dark:bg-black/20 rounded-full">High Score: {highScore}</span>
        <span className="px-3 py-1 bg-white/10 dark:bg-black/20 rounded-full">Lives: {lives}</span>
      </div>
      <div
        className="w-full max-w-2xl aspect-[4/3] relative cursor-none"
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
      >
        <canvas ref={canvasRef} className="w-full h-full bg-slate-800 rounded-lg shadow-2xl"></canvas>

        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center rounded-lg backdrop-blur-sm cursor-default">
            {gameState === 'over' && <p className="text-5xl font-extrabold text-white">Game Over</p>}
            {gameState === 'won' && <p className="text-5xl font-extrabold text-white">You Win!</p>}
            <button onClick={handlePlayPause} className="mt-6 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-xl shadow-lg">
              {
                gameState === 'start' ? 'Start Game' :
                  gameState === 'paused' ? 'Resume' : 'Play Again'
              }
            </button>
            {gameState === 'start' && <p className="mt-4 text-sm text-gray-300">Move mouse or drag anywhere to control paddle.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default BreakoutPage;
