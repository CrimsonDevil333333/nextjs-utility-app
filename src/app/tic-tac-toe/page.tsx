'use client';

import { useState, useEffect, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
// ✅ Import Timer and BrainCircuit icons
import { X, Circle, RefreshCw, User, Bot, BrainCircuit, Timer } from 'lucide-react';

type Player = 'X' | 'O';
type SquareValue = Player | null;
type GameMode = 'playerVsPlayer' | 'playerVsAi';
type AiAnalysis = { index: number; score: number };

// --- Helper function to calculate winner (no changes) ---
function calculateWinner(squares: SquareValue[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: lines[i] };
    }
  }
  return { winner: null, winningLine: null };
}

export default function TicTacToePage() {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [gameMode, setGameMode] = useState<GameMode>('playerVsAi');
  
  const [showAiThinking, setShowAiThinking] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis[] | null>(null);
  // ✅ NEW STATE: For the AI's thinking time delay
  const [aiThinkingTime, setAiThinkingTime] = useState(1200);

  const { winner, winningLine } = calculateWinner(board);
  const isDraw = board.every(Boolean) && !winner;

  const humanPlayer: Player = 'X';
  const aiPlayer: Player = 'O';

  const makeMove = useCallback((i: number) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setAiAnalysis(null);
  }, [board, isXNext, winner]);

  const handleClick = (i: number) => {
    if (gameMode === 'playerVsAi' && !isXNext) return;
    triggerHapticFeedback();
    makeMove(i);
  };

  // --- AI Logic Effect Hook ---
  useEffect(() => {
    if (gameMode === 'playerVsAi' && !isXNext && !winner && !isDraw) {
      
      const analyzeMoves = (currentBoard: SquareValue[]): AiAnalysis[] => {
        const emptySquares = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
        
        const minimax = (newBoard: SquareValue[], player: Player): { score: number } => {
          const availableSquares = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
          const gameResult = calculateWinner(newBoard);

          if (gameResult.winner === humanPlayer) return { score: -10 };
          if (gameResult.winner === aiPlayer) return { score: 10 };
          if (availableSquares.length === 0) return { score: 0 };
          
          let bestScore = player === aiPlayer ? -Infinity : Infinity;

          for (const squareIndex of availableSquares) {
            newBoard[squareIndex] = player;
            const result = minimax(newBoard, player === aiPlayer ? humanPlayer : aiPlayer);
            newBoard[squareIndex] = null;
            bestScore = player === aiPlayer ? Math.max(bestScore, result.score) : Math.min(bestScore, result.score);
          }
          return { score: bestScore };
        };

        const movesWithScores: AiAnalysis[] = [];
        for (const squareIndex of emptySquares) {
            const tempBoard = [...currentBoard];
            tempBoard[squareIndex] = aiPlayer;
            const result = minimax(tempBoard, humanPlayer);
            movesWithScores.push({ index: squareIndex, score: result.score });
        }
        return movesWithScores;
      };
      
      const analysisResults = analyzeMoves([...board]);
      const bestMove = analysisResults.reduce((best, current) => {
          return current.score > best.score ? current : best;
      }, { index: -1, score: -Infinity });

      if (showAiThinking) {
        setAiAnalysis(analysisResults);
      }
      
      // ✅ Use the state variable for the timeout duration
      const aiMoveTimeout = setTimeout(() => {
        if (bestMove.index !== -1) {
          makeMove(bestMove.index);
        }
      }, aiThinkingTime);

      return () => clearTimeout(aiMoveTimeout);
    }
  }, [isXNext, gameMode, board, winner, isDraw, makeMove, showAiThinking, aiThinkingTime]);

  useEffect(() => {
    if (winner) {
      setScores(prevScores => ({...prevScores, [winner]: prevScores[winner as Player] + 1}));
    }
  }, [winner]);

  // --- Render Functions ---
  const renderSquare = (i: number) => {
    const isWinnerSquare = winningLine?.includes(i);
    const analysisForSquare = aiAnalysis?.find(a => a.index === i);

    const getScoreColor = (score: number) => {
        if (score > 0) return 'text-green-500';
        if (score < 0) return 'text-red-500';
        return 'text-gray-400';
    }

    return (
      <button
        key={i}
        className={`relative aspect-square w-full bg-gray-200 dark:bg-gray-700 text-4xl font-bold transition-colors duration-300 border border-gray-400 dark:border-gray-600 flex items-center justify-center ${isWinnerSquare ? 'bg-green-400 dark:bg-green-800' : ''}`}
        onClick={() => handleClick(i)}
        disabled={!!board[i] || !!winner || (gameMode === 'playerVsAi' && !isXNext)}
      >
        {showAiThinking && analysisForSquare ? (
          <span className={`text-2xl font-mono ${getScoreColor(analysisForSquare.score)}`}>
            {analysisForSquare.score > 0 ? `+${analysisForSquare.score}`: analysisForSquare.score}
          </span>
        ) : (
          <>
            {board[i] === 'X' && <X className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-blue-500" />}
            {board[i] === 'O' && <Circle className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-red-500" />}
          </>
        )}
      </button>
    );
  };

  const getStatus = () => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return 'Draw!';
    if (aiAnalysis && showAiThinking) return 'AI is thinking...';
    return `Next player: ${isXNext ? 'X' : 'O'}`;
  };

  // --- Control Functions ---
  const resetGame = (newGameMode?: GameMode) => {
    triggerHapticFeedback();
    setBoard(Array(9).fill(null));
    setAiAnalysis(null);
    setIsXNext(true);
    if(newGameMode) setGameMode(newGameMode);
  };

  const resetScores = () => {
    triggerHapticFeedback();
    setScores({ X: 0, O: 0 });
  };
  
  const handleModeChange = (mode: GameMode) => {
    resetGame(mode);
  }

  // --- JSX Return ---
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Tic Tac Toe</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-4">
            <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1 shadow-inner">
              <button onClick={() => handleModeChange('playerVsPlayer')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${gameMode === 'playerVsPlayer' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}><User size={16} /> Player</button>
              <button onClick={() => handleModeChange('playerVsAi')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${gameMode === 'playerVsAi' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}><Bot size={16} /> AI</button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl sm:text-2xl font-semibold">{getStatus()}</div>
            <div className="flex gap-4 text-sm sm:text-base">
              <span>X Wins: {scores.X}</span>
              <span>O Wins: {scores.O}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-0 w-full grid-[border-collapse:collapse]">
            {Array.from({ length: 9 }).map((_, i) => renderSquare(i))}
          </div>
          
          {/* ✅ NEW: AI Controls Section */}
          {gameMode === 'playerVsAi' && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-center">
                  <label htmlFor="ai-thinking-toggle" className="flex items-center gap-3 cursor-pointer text-sm">
                      <BrainCircuit size={16} />
                      <span>Show AI Thinking</span>
                      <div className="relative">
                          <input id="ai-thinking-toggle" type="checkbox" className="sr-only" checked={showAiThinking} onChange={() => setShowAiThinking(!showAiThinking)} />
                          <div className={`block w-10 h-6 rounded-full ${showAiThinking ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showAiThinking ? 'translate-x-full' : ''}`}></div>
                      </div>
                  </label>
              </div>
              <div className="flex items-center gap-3 text-sm">
                  <Timer size={16}/>
                  <label htmlFor="ai-speed-slider" className="flex-shrink-0">AI Speed</label>
                  <input 
                    id="ai-speed-slider"
                    type="range" 
                    min="200" 
                    max="3000" 
                    step="100"
                    value={aiThinkingTime}
                    onChange={(e) => setAiThinkingTime(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="w-16 text-right font-mono">{aiThinkingTime}ms</span>
              </div>
            </div>
          )}

          <div className={`flex gap-4 ${gameMode === 'playerVsAi' ? 'mt-4' : 'mt-6'}`}>
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg" onClick={() => resetGame()}>
              <RefreshCw size={20} /> Reset Game
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-lg" onClick={resetScores}>
              Reset Scores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}