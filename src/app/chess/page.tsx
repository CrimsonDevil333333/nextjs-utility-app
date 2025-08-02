'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';
import { RefreshCw, Crown, User, Bot, Copy, Check, Play, Square } from 'lucide-react';

// --- Types and Constants ---
type Player = 'w' | 'b';
type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
interface Piece {
  type: PieceType;
  player: Player;
}
type Board = (Piece | null)[][];
type Move = { from: [number, number]; to: [number, number] };

const PIECE_UNICODE: Record<Player, Record<PieceType, string>> = {
  w: { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' },
  b: { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' },
};

// --- Main Game Component ---
const ChessPage = () => {
  const [board, setBoard] = useState<Board>([]);
  const [turn, setTurn] = useState<Player>('w');
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [gameState, setGameState] = useState<'playing' | 'check' | 'checkmate' | 'stalemate'>('playing');
  const [winner, setWinner] = useState<Player | null>(null);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<Record<Player, Piece[]>>({ w: [], b: [] });
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameMode, setGameMode] = useState<'playerVsPlayer' | 'playerVsComputer'>('playerVsComputer');
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
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = currentBoard[r][c];
          if (piece && piece.player === attacker) {
            const moves = getPieceMoves([r, c], piece, currentBoard, true);
            if (moves.some(m => m[0] === pos[0] && m[1] === pos[1])) return true;
          }
        }
      }
      return false;
    };

    const getPieceMoves = (pos: [number, number], piece: Piece, currentBoard: Board, rawMoves = false): [number, number][] => {
      const moves: [number, number][] = [];
      const [r, c] = pos;
      const addMove = (nr: number, nc: number) => {
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const target = currentBoard[nr][nc];
          if (!target || target.player !== piece.player) moves.push([nr, nc]);
        }
      };
      const addSlidingMoves = (directions: [number, number][]) => {
        for (const [dr, dc] of directions) {
          for (let i = 1; i < 8; i++) {
            const nr = r + i * dr;
            const nc = c + i * dc;
            if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
            const target = currentBoard[nr][nc];
            if (target) {
              if (target.player !== piece.player) moves.push([nr, nc]);
              break;
            }
            moves.push([nr, nc]);
          }
        }
      };

      switch (piece.type) {
        case 'p':
          const dir = piece.player === 'w' ? -1 : 1;
          const startRow = piece.player === 'w' ? 6 : 1;
          if (!currentBoard[r + dir]?.[c]) {
            addMove(r + dir, c);
            if (r === startRow && !currentBoard[r + 2 * dir]?.[c]) addMove(r + 2 * dir, c);
          }
          [-1, 1].forEach(dc => {
            const target = currentBoard[r + dir]?.[c + dc];
            if (target && target.player !== piece.player) addMove(r + dir, c + dc);
          });
          break;
        case 'r': addSlidingMoves([[0, 1], [0, -1], [1, 0], [-1, 0]]); break;
        case 'n': [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => addMove(r + dr, c + dc)); break;
        case 'b': addSlidingMoves([[-1, -1], [-1, 1], [1, -1], [1, 1]]); break;
        case 'q': addSlidingMoves([[0, 1], [0, -1], [1, 0], [-1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]]); break;
        case 'k': [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dr, dc]) => addMove(r + dr, c + dc)); break;
      }

      if (!rawMoves) {
        return moves.filter(move => {
          const tempBoard = currentBoard.map(row => [...row]);
          tempBoard[move[0]][move[1]] = piece;
          tempBoard[r][c] = null;
          const kingPos = findKing(piece.player, tempBoard);
          return kingPos && !isSquareAttacked(kingPos, piece.player === 'w' ? 'b' : 'w', tempBoard);
        });
      }
      return moves;
    };

    const updateGameState = (currentBoard: Board, currentPlayer: Player): { state: 'playing' | 'check' | 'checkmate' | 'stalemate'; winner?: Player } => {
      const opponent = currentPlayer === 'w' ? 'b' : 'w';
      const kingPos = findKing(currentPlayer, currentBoard);
      if (!kingPos) return { state: 'playing' };
      const inCheck = isSquareAttacked(kingPos, opponent, currentBoard);
      let hasValidMoves = false;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = currentBoard[r][c];
          if (piece && piece.player === currentPlayer && getPieceMoves([r, c], piece, currentBoard).length > 0) {
            hasValidMoves = true;
            break;
          }
        }
        if (hasValidMoves) break;
      }
      if (!hasValidMoves) return inCheck ? { state: 'checkmate', winner: opponent } : { state: 'stalemate' };
      return inCheck ? { state: 'check' } : { state: 'playing' };
    };

    return { getPieceMoves, updateGameState };
  }, []);

  const initializeGame = useCallback(() => {
    triggerHapticFeedback();
    const initialBoard: Board = Array(8).fill(null).map(() => Array(8).fill(null));
    const setup = (r: number, player: Player) => {
      initialBoard[r] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'].map(t => ({ type: t as PieceType, player }));
      initialBoard[r === 0 ? 1 : 6] = Array(8).fill(null).map(() => ({ type: 'p', player }));
    };
    setup(0, 'b');
    setup(7, 'w');
    setBoard(initialBoard);
    setTurn('w');
    setSelectedPiece(null);
    setValidMoves([]);
    setGameState('playing');
    setWinner(null);
    setLastMove(null);
    setCapturedPieces({ w: [], b: [] });
    setMoveHistory([]);
    setHistoryInput('');
    setIsReplaying(false);
    setReplayError(null);
  }, []);

  useEffect(() => { initializeGame(); }, [initializeGame]);

  const toAlgebraic = (pos: [number, number]) => `${'abcdefgh'[pos[1]]}${8 - pos[0]}`;

  const performMove = useCallback((from: [number, number], to: [number, number]) => {
    const [sr, sc] = from;
    const [r, c] = to;

    const newBoard = board.map(row => [...row]);
    const pieceToMove = newBoard[sr][sc]!;
    const captured = newBoard[r][c];
    if (captured) {
      const newCaptured = { ...capturedPieces };
      newCaptured[captured.player === 'w' ? 'b' : 'w'].push(captured);
      setCapturedPieces(newCaptured);
    }
    newBoard[r][c] = pieceToMove;
    newBoard[sr][sc] = null;
    if (pieceToMove.type === 'p' && (r === 0 || r === 7)) pieceToMove.type = 'q';
    const nextTurn = turn === 'w' ? 'b' : 'w';
    const { state, winner } = gameLogic.updateGameState(newBoard, nextTurn);
    setBoard(newBoard);
    setTurn(nextTurn);
    setGameState(state);
    setWinner(winner || null);
    setLastMove({ from, to });
    setMoveHistory(prev => [...prev, `${PIECE_UNICODE[turn][pieceToMove.type]} ${toAlgebraic(from)} -> ${toAlgebraic(to)}`]);
    setSelectedPiece(null);
    setValidMoves([]);
  }, [board, capturedPieces, gameLogic, turn]);

  const handleSquareClick = (r: number, c: number) => {
    if (isReplaying || gameState === 'checkmate' || gameState === 'stalemate' || (gameMode === 'playerVsComputer' && turn === 'b')) return;
    triggerHapticFeedback();

    if (selectedPiece) {
      const [sr, sc] = selectedPiece;
      const isValid = validMoves.some(([vr, vc]) => vr === r && vc === c);
      if (isValid) {
        performMove([sr, sc], [r, c]);
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
        const piece = board[r][c];
        if (piece && piece.player === turn) {
          setSelectedPiece([r, c]);
          setValidMoves(gameLogic.getPieceMoves([r, c], piece, board));
        }
      }
    } else {
      const piece = board[r][c];
      if (piece && piece.player === turn) {
        setSelectedPiece([r, c]);
        setValidMoves(gameLogic.getPieceMoves([r, c], piece, board));
      }
    }
  };

  useEffect(() => {
    if (gameMode === 'playerVsComputer' && turn === 'b' && gameState !== 'checkmate' && gameState !== 'stalemate') {
      const timer = setTimeout(() => {
        const allMoves: { piece: Piece, from: [number, number], to: [number, number] }[] = [];
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.player === 'b') {
              const moves = gameLogic.getPieceMoves([r, c], piece, board);
              moves.forEach(move => allMoves.push({ piece, from: [r, c], to: move }));
            }
          }
        }
        if (allMoves.length > 0) {
          const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
          performMove(randomMove.from, randomMove.to);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [turn, gameMode, board, gameState, gameLogic, performMove]);

  const handleReplay = () => {
    triggerHapticFeedback();
    setIsReplaying(true);
    setReplayError(null);

    const movesToPlay = historyInput.split('\n').filter(line => line.trim() !== '');
    if (movesToPlay.length === 0) {
      setIsReplaying(false);
      return;
    }

    initializeGame();

    let moveIndex = 0;
    const intervalId = setInterval(() => {
      if (moveIndex >= movesToPlay.length) {
        clearInterval(intervalId);
        setIsReplaying(false);
        return;
      }

      const moveString = movesToPlay[moveIndex];
      const match = moveString.match(/([a-h][1-8]).*?([a-h][1-8])/);

      if (!match) {
        setReplayError(`Invalid format on line ${moveIndex + 1}: "${moveString}"`);
        setIsReplaying(false);
        clearInterval(intervalId);
        return;
      }

      const fromCoord = match[1];
      const toCoord = match[2];
      const fromCol = fromCoord.charCodeAt(0) - 97;
      const fromRow = 8 - parseInt(fromCoord.substring(1));
      const toCol = toCoord.charCodeAt(0) - 97;
      const toRow = 8 - parseInt(toCoord.substring(1));

      setBoard(currentBoard => {
        const pieceToMove = currentBoard[fromRow]?.[fromCol];
        if (!pieceToMove) {
          setReplayError(`No piece at ${fromCoord} on move ${moveIndex + 1}`);
          setIsReplaying(false);
          clearInterval(intervalId);
          return currentBoard;
        }

        const validMovesForPiece = gameLogic.getPieceMoves([fromRow, fromCol], pieceToMove, currentBoard);
        if (!validMovesForPiece.some(m => m[0] === toRow && m[1] === toCol)) {
          setReplayError(`Illegal move ${fromCoord} -> ${toCoord} on move ${moveIndex + 1}`);
          setIsReplaying(false);
          clearInterval(intervalId);
          return currentBoard;
        }

        const newBoard = currentBoard.map(r => [...r]);
        const captured = newBoard[toRow][toCol];
        if (captured) {
          setCapturedPieces(prev => ({ ...prev, [captured.player === 'w' ? 'b' : 'w']: [...prev[captured.player === 'w' ? 'b' : 'w'], captured] }));
        }
        newBoard[toRow][toCol] = pieceToMove;
        newBoard[fromRow][fromCol] = null;
        if (pieceToMove.type === 'p' && (toRow === 0 || toRow === 7)) pieceToMove.type = 'q';

        setLastMove({ from: [fromRow, fromCol], to: [toRow, toCol] });
        setMoveHistory(prev => [...prev, moveString]);
        setTurn(prev => prev === 'w' ? 'b' : 'w');

        return newBoard;
      });

      moveIndex++;
    }, 1000);
    replayIntervalRef.current = intervalId;
  };

  const handleStopReplay = () => {
    triggerHapticFeedback();
    if (replayIntervalRef.current) {
      clearInterval(replayIntervalRef.current);
    }
    setIsReplaying(false);
  };

  const handleCopyHistory = () => {
    triggerHapticFeedback();
    navigator.clipboard.writeText(moveHistory.join('\n'));
    setIsHistoryCopied(true);
    setTimeout(() => setIsHistoryCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Chess ♟️</h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start lg:justify-center">
          <div className="w-full max-w-md lg:max-w-xl">
            <div className={`w-full aspect-square grid grid-cols-8 shadow-2xl rounded-lg overflow-hidden border-4 border-gray-300 dark:border-gray-700 ${isReplaying ? 'pointer-events-none' : ''}`}>
              {Array(8).fill(null).map((_, r) => Array(8).fill(null).map((_, c) => {
                const piece = board[r]?.[c];
                const isDark = (r + c) % 2 === 1;
                const isSelected = selectedPiece && selectedPiece[0] === r && selectedPiece[1] === c;
                const isMove = validMoves.some(([vr, vc]) => vr === r && vc === c);
                const isLastMove = lastMove && ((lastMove.from[0] === r && lastMove.from[1] === c) || (lastMove.to[0] === r && lastMove.to[1] === c));
                return (
                  <div key={`${r}-${c}`} className={`w-full aspect-square flex justify-center items-center transition-colors relative ${isDark ? 'bg-slate-500 dark:bg-slate-600' : 'bg-slate-200 dark:bg-slate-300'} cursor-pointer`} onClick={() => handleSquareClick(r, c)}>
                    {isLastMove && <div className="absolute inset-0 bg-yellow-400/50" />}
                    {isSelected && <div className="absolute inset-0 ring-4 ring-yellow-500/80 z-10" />}
                    {piece && <span className={`text-5xl sm:text-6xl md:text-7xl z-0 ${piece.player === 'w' ? 'text-white' : 'text-black'}`} style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>{PIECE_UNICODE[piece.player][piece.type]}</span>}
                    {isMove && <div className="absolute w-full h-full flex justify-center items-center"><div className={`w-1/3 h-1/3 rounded-full ${piece ? 'bg-red-500/40 ring-4 ring-red-500/60' : 'bg-gray-900/20'}`}></div></div>}
                  </div>
                );
              }))}
            </div>
          </div>
          <div className="w-full max-w-md lg:max-w-xs lg:w-1/3 space-y-4">
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-700 dark:text-gray-300">Captured by White</h3>
              <div className="flex flex-wrap items-center gap-1 min-h-[40px] text-3xl">{capturedPieces.w.map((p, i) => <span key={i}>{PIECE_UNICODE[p.player][p.type]}</span>)}</div>
            </div>
            <div className={`p-3 rounded-lg text-center font-semibold text-lg ${gameState === 'checkmate' || gameState === 'stalemate' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/80 dark:bg-slate-800/80'}`}>
              {gameState === 'checkmate' && <Crown className="inline-block mr-2 mb-1" />}
              {gameState === 'checkmate' ? `Checkmate! ${winner === 'w' ? 'White' : 'Black'} wins.` : gameState === 'stalemate' ? 'Stalemate! Draw.' : gameState === 'check' ? `${turn === 'w' ? 'White' : 'Black'} is in check!` : `${turn === 'w' ? 'White' : 'Black'} to move`}
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-700 dark:text-gray-300">Captured by Black</h3>
              <div className="flex flex-wrap items-center gap-1 min-h-[40px] text-3xl">{capturedPieces.b.map((p, i) => <span key={i}>{PIECE_UNICODE[p.player][p.type]}</span>)}</div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-700 dark:text-gray-300">Move History</h3>
                <button onClick={handleCopyHistory} className="p-1 text-gray-500 hover:text-blue-500">{isHistoryCopied ? <Check size={16} /> : <Copy size={16} />}</button>
              </div>
              <div className="h-24 overflow-y-auto text-sm font-mono space-y-1">
                {moveHistory.map((move, i) => <div key={i} className="flex gap-2"><span className="w-6">{Math.floor(i / 2) + 1}.</span><span>{move}</span></div>)}
              </div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Replay History</h3>
              <textarea value={historyInput} onChange={(e) => setHistoryInput(e.target.value)} placeholder="Paste move history here..." rows={3} className="w-full p-2 border rounded-md font-mono dark:bg-gray-700 dark:border-gray-600" />
              {isReplaying ? (
                <button onClick={handleStopReplay} className="w-full mt-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"><Square size={18} /> Stop</button>
              ) : (
                <button onClick={handleReplay} disabled={isReplaying} className="w-full mt-2 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 flex items-center justify-center gap-2"><Play size={18} /> Replay</button>
              )}
              {replayError && <p className="text-red-500 text-xs mt-2">{replayError}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setGameMode('playerVsPlayer'); initializeGame(); }} className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${gameMode === 'playerVsPlayer' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><User size={18} /> Player</button>
              <button onClick={() => { setGameMode('playerVsComputer'); initializeGame(); }} className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${gameMode === 'playerVsComputer' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><Bot size={18} /> Computer</button>
            </div>
            <button onClick={initializeGame} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow">
              <RefreshCw size={18} /> New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessPage;
