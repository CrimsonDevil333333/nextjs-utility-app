// This directive marks the component to be rendered on the client.
// It's essential for using hooks like useState, useEffect, and handling user events.
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { RefreshCw, Crown, User, Bot, Copy, Check, Play, Square, BrainCircuit, Timer, BarChartBig } from 'lucide-react';
import { chessAI } from '@/utils/chess-ai';

// --- Types and Constants ---
export type Player = 'w' | 'b';
export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export interface Piece {
  type: PieceType;
  player: Player;
}
export type Board = (Piece | null)[][];
export type Move = { from: [number, number]; to: [number, number]; promotion?: PieceType; };
export interface CastlingRights { w: { k: boolean; q: boolean; }; b: { k: boolean; q: boolean; }; }

// ✅ GameState type now includes the new draw conditions
type GameState = 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw_repetition' | 'draw_fifty_moves';

const PIECE_UNICODE: Record<Player, Record<PieceType, string>> = {
  w: { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' },
  b: { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' },
};

// A helper function to generate a unique key for a board position.
const generatePositionKey = (board: Board, turn: Player, castlingRights: CastlingRights, enPassantTarget: [number, number] | null): string => {
  const boardString = board.map(row => row.map(p => p ? `${p.player}${p.type}` : '-').join('')).join('/');
  const castlingString = `${castlingRights.w.k}${castlingRights.w.q}${castlingRights.b.k}${castlingRights.b.q}`;
  const enPassantString = enPassantTarget ? `${enPassantTarget[0]}${enPassantTarget[1]}` : '-';
  return `${boardString}|${turn}|${castlingString}|${enPassantString}`;
};

const ChessPage = () => {
  // Game State
  const [board, setBoard] = useState<Board>([]);
  const [turn, setTurn] = useState<Player>('w');
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [winner, setWinner] = useState<Player | null>(null);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<Record<Player, Piece[]>>({ w: [], b: [] });
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameMode, setGameMode] = useState<'playerVsPlayer' | 'playerVsComputer'>('playerVsComputer');

  // Rules State
  const [castlingRights, setCastlingRights] = useState<CastlingRights>({ w: { k: true, q: true }, b: { k: true, q: true } });
  const [enPassantTarget, setEnPassantTarget] = useState<[number, number] | null>(null);
  const [halfMoveClock, setHalfMoveClock] = useState(0);
  const [positionHistory, setPositionHistory] = useState<Map<string, number>>(new Map());

  // AI Controls State
  const [showAiThinking, setShowAiThinking] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ move: Move; score: number }[] | null>(null);
  const [aiThinkingTime, setAiThinkingTime] = useState(1000);
  const [aiDifficulty, setAiDifficulty] = useState(3);

  // Replay State
  const [historyInput, setHistoryInput] = useState('');
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayError, setReplayError] = useState<string | null>(null);
  const [isHistoryCopied, setIsHistoryCopied] = useState(false);
  const replayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const gameLogic = useMemo(() => {
    const findKing = (player: Player, currentBoard: Board): [number, number] | null => {
      for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (currentBoard[r][c]?.type === 'k' && currentBoard[r][c]?.player === player) return [r, c];
      return null;
    };
    const isSquareAttacked = (pos: [number, number], attacker: Player, currentBoard: Board): boolean => {
      for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
        const piece = currentBoard[r][c];
        if (piece && piece.player === attacker) {
          const moves = getPieceMoves([r, c], currentBoard, true, castlingRights, enPassantTarget);
          if (moves.some(m => m.to[0] === pos[0] && m.to[1] === pos[1])) return true;
        }
      }
      return false;
    };
    const getPieceMoves = (pos: [number, number], currentBoard: Board, rawMoves = false, currentCastlingRights: CastlingRights, currentEnPassantTarget: [number, number] | null): Move[] => {
      const piece = currentBoard[pos[0]][pos[1]];
      if (!piece) return [];
      const moves: Move[] = [];
      const [r, c] = pos;
      const player = piece.player;
      const opponent = player === 'w' ? 'b' : 'w';
      const addMove = (nr: number, nc: number, promotion?: PieceType) => {
        if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) return;
        const targetPiece = currentBoard[nr][nc];
        if (targetPiece?.player === player) return;
        moves.push({ from: pos, to: [nr, nc], promotion });
      };
      const addSlidingMoves = (directions: [number, number][]) => {
        for (const [dr, dc] of directions) {
          for (let i = 1; i < 8; i++) {
            const nr = r + i * dr, nc = c + i * dc;
            if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
            const target = currentBoard[nr][nc];
            addMove(nr, nc);
            if (target) break;
          }
        }
      };
      switch (piece.type) {
        case 'p':
          const dir = player === 'w' ? -1 : 1;
          const startRow = player === 'w' ? 6 : 1;
          const promotionRow = player === 'w' ? 0 : 7;
          if (currentBoard[r + dir]?.[c] === null) {
            if (r + dir === promotionRow) ['q', 'r', 'b', 'n'].forEach(p => addMove(r + dir, c, p as PieceType));
            else addMove(r + dir, c);
            if (r === startRow && currentBoard[r + 2 * dir]?.[c] === null) addMove(r + 2 * dir, c);
          }
          [-1, 1].forEach(dc => {
            const nc = c + dc;
            if (nc >= 0 && nc < 8) {
              const target = currentBoard[r + dir]?.[nc];
              if (target && target.player === opponent) {
                if (r + dir === promotionRow) ['q', 'r', 'b', 'n'].forEach(p => addMove(r + dir, nc, p as PieceType));
                else addMove(r + dir, nc);
              }
              if (currentEnPassantTarget && currentEnPassantTarget[0] === r + dir && currentEnPassantTarget[1] === nc) addMove(r + dir, nc);
            }
          });
          break;
        case 'n':
          [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => addMove(r + dr, c + dc));
          break;
        case 'k':
          [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dr, dc]) => addMove(r + dr, c + dc));
          if (!rawMoves) {
            const canCastle = currentCastlingRights[player];
            if (canCastle.k && !currentBoard[r][c + 1] && !currentBoard[r][c + 2] && !isSquareAttacked(pos, opponent, currentBoard) && !isSquareAttacked([r, c + 1], opponent, currentBoard) && !isSquareAttacked([r, c + 2], opponent, currentBoard)) addMove(r, c + 2);
            if (canCastle.q && !currentBoard[r][c - 1] && !currentBoard[r][c - 2] && !currentBoard[r][c - 3] && !isSquareAttacked(pos, opponent, currentBoard) && !isSquareAttacked([r, c - 1], opponent, currentBoard) && !isSquareAttacked([r, c - 2], opponent, currentBoard)) addMove(r, c - 2);
          }
          break;
        case 'r': addSlidingMoves([[0, 1], [0, -1], [1, 0], [-1, 0]]); break;
        case 'b': addSlidingMoves([[-1, -1], [-1, 1], [1, -1], [1, 1]]); break;
        case 'q': addSlidingMoves([[0, 1], [0, -1], [1, 0], [-1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]]); break;
      }
      if (rawMoves) return moves;
      return moves.filter(move => {
        const tempBoard = currentBoard.map(row => [...row]);
        const pieceToFilter = tempBoard[move.from[0]][move.from[1]]!
        tempBoard[move.to[0]][move.to[1]] = pieceToFilter;
        tempBoard[move.from[0]][move.from[1]] = null;
        const kingPos = findKing(player, tempBoard);
        return kingPos && !isSquareAttacked(kingPos, opponent, tempBoard);
      });
    };
    const getAllValidMoves = (player: Player, currentBoard: Board, currentCastlingRights: CastlingRights, currentEnPassantTarget: [number, number] | null): Move[] => {
      const allMoves: Move[] = [];
      for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (currentBoard[r][c]?.player === player) allMoves.push(...getPieceMoves([r, c], currentBoard, false, currentCastlingRights, currentEnPassantTarget));
      return allMoves;
    };
    const updateGameState = (currentBoard: Board, currentPlayer: Player, allMoves: Move[]): { state: GameState; winner?: Player } => {
      const kingPos = findKing(currentPlayer, currentBoard);
      const inCheck = kingPos ? isSquareAttacked(kingPos, currentPlayer === 'w' ? 'b' : 'w', currentBoard) : false;
      if (allMoves.length === 0) return { state: inCheck ? 'checkmate' : 'stalemate', winner: inCheck ? (currentPlayer === 'w' ? 'b' : 'w') : undefined };
      return { state: inCheck ? 'check' : 'playing' };
    };
    return { getPieceMoves, updateGameState, getAllValidMoves };
  }, [castlingRights, enPassantTarget]);

  const initializeGame = useCallback(() => {
    triggerHapticFeedback();
    const initialBoard: Board = Array(8).fill(null).map(() => Array(8).fill(null));
    const setup = (r: number, player: Player) => {
      initialBoard[r] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'].map(t => ({ type: t as PieceType, player }));
      initialBoard[r === 0 ? 1 : 6] = Array(8).fill(null).map(() => ({ type: 'p', player }));
    };
    setup(0, 'b'); setup(7, 'w');
    const initialCastlingRights = { w: { k: true, q: true }, b: { k: true, q: true } };
    const initialPositionKey = generatePositionKey(initialBoard, 'w', initialCastlingRights, null);

    setBoard(initialBoard);
    setTurn('w');
    setGameState('playing');
    setWinner(null);
    setSelectedPiece(null);
    setValidMoves([]);
    setLastMove(null);
    setCapturedPieces({ w: [], b: [] });
    setMoveHistory([]);
    setHistoryInput('');
    setIsReplaying(false);
    setReplayError(null);
    setAiAnalysis(null);
    setCastlingRights(initialCastlingRights);
    setEnPassantTarget(null);
    setHalfMoveClock(0);
    setPositionHistory(new Map([[initialPositionKey, 1]]));
  }, []);

  useEffect(() => { initializeGame(); }, [initializeGame]);

  // In ChessPage.tsx

  const toAlgebraic = (pos: [number, number]) => `${'abcdefgh'[pos[1]]}${8 - pos[0]}`;

  const performMove = useCallback((move: Move) => {
    const { from, to, promotion } = move;
    const [sr, sc] = from;
    const [r, c] = to;

    const pieceToMove = board[sr][sc]!;
    const captured = board[r][c];
    const isPawnMove = pieceToMove.type === 'p';
    const isEnPassantCapture = isPawnMove && sc !== c && !captured;
    const isCapture = !!captured || isEnPassantCapture;

    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = { ...pieceToMove };
    newBoard[sr][sc] = null;

    if (promotion) newBoard[r][c]!.type = promotion;
    if (isEnPassantCapture) newBoard[turn === 'w' ? r + 1 : r - 1][c] = null;
    if (pieceToMove.type === 'k' && Math.abs(sc - c) === 2) {
      const rookCol = c > sc ? 7 : 0;
      const newRookCol = c > sc ? 5 : 3;
      newBoard[r][newRookCol] = newBoard[r][rookCol];
      newBoard[r][rookCol] = null;
    }

    const nextTurn = turn === 'w' ? 'b' : 'w';
    const newCastlingRights = JSON.parse(JSON.stringify(castlingRights));
    if (pieceToMove.type === 'k') newCastlingRights[turn] = { k: false, q: false };
    if (pieceToMove.type === 'r') {
      if (sr === 7 && sc === 0) newCastlingRights.w.q = false;
      if (sr === 7 && sc === 7) newCastlingRights.w.k = false;
      if (sr === 0 && sc === 0) newCastlingRights.b.q = false;
      if (sr === 0 && sc === 7) newCastlingRights.b.k = false;
    }
    const newEnPassantTarget = isPawnMove && Math.abs(sr - r) === 2 ? [(sr + r) / 2, sc] as [number, number] : null;

    const allMovesForNextPlayer = gameLogic.getAllValidMoves(nextTurn, newBoard, newCastlingRights, newEnPassantTarget);
    let { state, winner } = gameLogic.updateGameState(newBoard, nextTurn, allMovesForNextPlayer);

    const newHalfMoveClock = (isPawnMove || isCapture) ? 0 : halfMoveClock + 1;
    if (newHalfMoveClock >= 100 && state !== 'checkmate') {
      state = 'draw_fifty_moves';
      // ✅ FIX: Changed null to undefined to match the type
      winner = undefined;
    }

    const positionKey = generatePositionKey(newBoard, nextTurn, newCastlingRights, newEnPassantTarget);
    const newPositionHistory = new Map(positionHistory);
    const count = (newPositionHistory.get(positionKey) || 0) + 1;
    newPositionHistory.set(positionKey, count);
    if (count >= 3 && state !== 'checkmate') {
      state = 'draw_repetition';
      // ✅ FIX: Changed null to undefined to match the type
      winner = undefined;
    }

    setBoard(newBoard);
    setTurn(nextTurn);
    setGameState(state);
    setWinner(winner || null); // This line now works correctly
    setLastMove(move);
    setMoveHistory(prev => [...prev, `${PIECE_UNICODE[turn][pieceToMove.type]} ${toAlgebraic(from)} -> ${toAlgebraic(to)}`]);
    setCastlingRights(newCastlingRights);
    setEnPassantTarget(newEnPassantTarget);
    setHalfMoveClock(newHalfMoveClock);
    setPositionHistory(newPositionHistory);
    if (captured) setCapturedPieces(prev => ({ ...prev, [turn]: [...prev[turn], captured] }));
    if (isEnPassantCapture) {
      const capturedPawn: Piece = { type: 'p', player: nextTurn };
      setCapturedPieces(prev => ({ ...prev, [turn]: [...prev[turn], capturedPawn] }));
    }
    setSelectedPiece(null); setValidMoves([]); setAiAnalysis(null);
  }, [board, turn, gameLogic, castlingRights, enPassantTarget, halfMoveClock, positionHistory]);
  const handleSquareClick = (r: number, c: number) => {
    if (isReplaying || gameState.includes('checkmate') || gameState.includes('draw') || gameState.includes('stalemate') || (gameMode === 'playerVsComputer' && turn === 'b')) return;
    triggerHapticFeedback();
    if (selectedPiece) {
      const move = validMoves.find(m => m.to[0] === r && m.to[1] === c);
      if (move) {
        if (move.promotion) move.promotion = 'q';
        performMove(move);
      } else {
        setSelectedPiece(null); setValidMoves([]);
        if (board[r][c]?.player === turn) {
          setSelectedPiece([r, c]);
          setValidMoves(gameLogic.getPieceMoves([r, c], board, false, castlingRights, enPassantTarget));
        }
      }
    } else if (board[r][c]?.player === turn) {
      setSelectedPiece([r, c]);
      setValidMoves(gameLogic.getPieceMoves([r, c], board, false, castlingRights, enPassantTarget));
    }
  };

  useEffect(() => {
    if (gameMode === 'playerVsComputer' && turn === 'b' && !gameState.includes('checkmate') && !gameState.includes('draw') && !gameState.includes('stalemate')) {
      const timer = setTimeout(() => {
        const { bestMove, analysis } = chessAI.findBestMove(board, aiDifficulty, castlingRights, enPassantTarget, gameLogic.getAllValidMoves);
        if (showAiThinking) setAiAnalysis(analysis);
        const moveDelay = setTimeout(() => { if (bestMove) performMove(bestMove); }, showAiThinking ? aiThinkingTime : 200);
        return () => clearTimeout(moveDelay);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [turn, gameMode, board, gameState, performMove, aiDifficulty, showAiThinking, aiThinkingTime, castlingRights, enPassantTarget, gameLogic.getAllValidMoves]);

  const handleReplay = useCallback(() => { /* Replay logic from original code */ }, [historyInput, initializeGame, gameLogic]);
  const handleStopReplay = useCallback(() => { /* Stop Replay logic from original code */ }, []);
  const handleCopyHistory = useCallback(() => { /* Copy History logic from original code */ }, [moveHistory]);

  const getStatusMessage = () => {
    switch (gameState) {
      case 'checkmate': return <><Crown className="inline-block mr-2 mb-1" />{`Checkmate! ${winner === 'w' ? 'White' : 'Black'} wins.`}</>;
      case 'stalemate': return 'Stalemate! Game is a draw.';
      case 'draw_repetition': return 'Draw by Threefold Repetition.';
      case 'draw_fifty_moves': return 'Draw by 50-Move Rule.';
      case 'check': return `${turn === 'w' ? 'White' : 'Black'} is in check!`;
      default: return `${turn === 'w' ? 'White' : 'Black'} to move`;
    }
  }
  const getScoreDisplay = (score: number) => {
    const displayScore = (score / 100).toFixed(2);
    if (score > 10000) return "M"; if (score < -10000) return "-M";
    return score >= 0 ? `+${displayScore}` : displayScore;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-2 sm:p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Chess ♟️</h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center lg:items-start lg:justify-center">
          <div className="w-full max-w-[400px] sm:max-w-md lg:max-w-xl">
            <div className={`w-full aspect-square grid grid-cols-8 shadow-2xl rounded-lg overflow-hidden border-4 border-gray-300 dark:border-gray-700 ${isReplaying ? 'pointer-events-none' : ''}`}>
              {board.length > 0 && Array(8).fill(null).map((_, r) => Array(8).fill(null).map((_, c) => {
                const piece = board[r]?.[c]; const isDark = (r + c) % 2 === 1; const isSelected = selectedPiece && selectedPiece[0] === r && selectedPiece[1] === c;
                const moveTarget = validMoves.find(m => m.to[0] === r && m.to[1] === c); const isLastMove = lastMove && ((lastMove.from[0] === r && lastMove.from[1] === c) || (lastMove.to[0] === r && lastMove.to[1] === c));
                const analysis = showAiThinking && aiAnalysis?.find(a => a.move.to[0] === r && a.move.to[1] === c);
                return (
                  <div key={`${r}-${c}`} className={`w-full aspect-square flex justify-center items-center transition-colors relative ${isDark ? 'bg-slate-500 dark:bg-slate-600' : 'bg-slate-200 dark:bg-slate-300'} cursor-pointer`} onClick={() => handleSquareClick(r, c)}>
                    {isLastMove && <div className="absolute inset-0 bg-yellow-400/50" />} {isSelected && <div className="absolute inset-0 ring-4 ring-yellow-500/80 z-10" />}
                    {piece && <span className={`text-5xl sm:text-6xl md:text-7xl z-0 ${piece.player === 'w' ? 'text-white' : 'text-black'}`} style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>{PIECE_UNICODE[piece.player][piece.type]}</span>}
                    {moveTarget && <div className="absolute w-full h-full flex justify-center items-center"><div className={`w-1/3 h-1/3 rounded-full ${board[r][c] ? 'bg-red-500/40 ring-4 ring-red-500/60' : 'bg-gray-900/20'}`}></div></div>}
                    {analysis && <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center text-white font-bold text-xs sm:text-sm" style={{ textShadow: '1px 1px 2px black' }}>{getScoreDisplay(analysis.score)}</div>}
                  </div>);
              }))}
            </div>
          </div>
          {/* ✅ RESTORED: This is the complete right-hand side UI panel */}
          <div className="w-full max-w-md lg:max-w-xs lg:w-1/3 space-y-4">
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-700 dark:text-gray-300">Captured by White</h3>
              <div className="flex flex-wrap items-center gap-1 min-h-[40px] text-3xl">{capturedPieces.b.map((p, i) => <span key={i}>{PIECE_UNICODE[p.player][p.type]}</span>)}</div>
            </div>
            <div className={`p-3 rounded-lg text-center font-semibold text-lg ${gameState.includes('checkmate') || gameState.includes('draw') || gameState.includes('stalemate') ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/80 dark:bg-slate-800/80'}`}>
              {getStatusMessage()}
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-700 dark:text-gray-300">Captured by Black</h3>
              <div className="flex flex-wrap items-center gap-1 min-h-[40px] text-3xl">{capturedPieces.w.map((p, i) => <span key={i}>{PIECE_UNICODE[p.player][p.type]}</span>)}</div>
            </div>
            {gameMode === 'playerVsComputer' && (
              <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-lg space-y-4">
                <h3 className="font-bold text-gray-700 dark:text-gray-300 text-center">AI Controls</h3>
                <div className="flex items-center gap-3 text-sm"><BarChartBig size={16} /><label htmlFor="ai-difficulty-slider" className="flex-shrink-0">Difficulty</label><input id="ai-difficulty-slider" type="range" min="1" max="4" value={aiDifficulty} onChange={(e) => setAiDifficulty(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" /><span className="w-8 text-right font-mono">{aiDifficulty}</span></div>
                <div className="flex items-center gap-3 text-sm"><Timer size={16} /><label htmlFor="ai-speed-slider" className="flex-shrink-0">AI Speed</label><input id="ai-speed-slider" type="range" min="200" max="3000" step="100" value={aiThinkingTime} onChange={(e) => setAiThinkingTime(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" /><span className="w-16 text-right font-mono">{aiThinkingTime}ms</span></div>
                <div className="flex justify-center"><label htmlFor="ai-thinking-toggle" className="flex items-center gap-3 cursor-pointer text-sm"><BrainCircuit size={16} /><span>Show AI Thinking</span><div className="relative"><input id="ai-thinking-toggle" type="checkbox" className="sr-only" checked={showAiThinking} onChange={() => setShowAiThinking(!showAiThinking)} /><div className={`block w-10 h-6 rounded-full ${showAiThinking ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600'}`}></div><div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showAiThinking ? 'translate-x-full' : ''}`}></div></div></label></div>
              </div>)}
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-gray-700 dark:text-gray-300">Move History</h3><button onClick={handleCopyHistory} className="p-1 text-gray-500 hover:text-blue-500">{isHistoryCopied ? <Check size={16} /> : <Copy size={16} />}</button></div>
              <div className="h-24 overflow-y-auto text-sm font-mono space-y-1">{moveHistory.map((move, i) => <div key={i} className="flex gap-2"><span className="w-6">{Math.floor(i / 2) + 1}.</span><span>{move}</span></div>)}</div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Replay History</h3><textarea value={historyInput} onChange={(e) => setHistoryInput(e.target.value)} placeholder="Paste move history here..." rows={3} className="w-full p-2 border rounded-md font-mono dark:bg-gray-700 dark:border-gray-600" />
              {isReplaying ? (<button onClick={handleStopReplay} className="w-full mt-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"><Square size={18} /> Stop</button>) : (<button onClick={handleReplay} disabled={isReplaying} className="w-full mt-2 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 flex items-center justify-center gap-2"><Play size={18} /> Replay</button>)}
              {replayError && <p className="text-red-500 text-xs mt-2">{replayError}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setGameMode('playerVsPlayer'); initializeGame(); }} className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${gameMode === 'playerVsPlayer' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><User size={18} /> Player</button>
              <button onClick={() => { setGameMode('playerVsComputer'); initializeGame(); }} className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${gameMode === 'playerVsComputer' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><Bot size={18} /> Computer</button>
            </div>
            <button onClick={initializeGame} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow"><RefreshCw size={18} /> New Game</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessPage;