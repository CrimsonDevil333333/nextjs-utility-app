'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, Crown } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

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

  // --- Game Logic Engine (Memoized for performance) ---
  const gameLogic = useMemo(() => {
    const findKing = (player: Player, currentBoard: Board): [number, number] | null => {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = currentBoard[r][c];
          if (piece && piece.type === 'k' && piece.player === player) {
            return [r, c];
          }
        }
      }
      return null;
    };

    const isSquareAttacked = (pos: [number, number], attacker: Player, currentBoard: Board): boolean => {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = currentBoard[r][c];
          if (piece && piece.player === attacker) {
            const moves = getPieceMoves([r, c], piece, currentBoard, true); // Get raw moves
            if (moves.some(m => m[0] === pos[0] && m[1] === pos[1])) {
              return true;
            }
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
          if (!target || target.player !== piece.player) {
            moves.push([nr, nc]);
          }
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
            if (r === startRow && !currentBoard[r + 2 * dir]?.[c]) {
              addMove(r + 2 * dir, c);
            }
          }
          [-1, 1].forEach(dc => {
            const target = currentBoard[r + dir]?.[c + dc];
            if (target && target.player !== piece.player) {
              addMove(r + dir, c + dc);
            }
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

    const updateGameState = (
      currentBoard: Board,
      currentPlayer: Player
    ): { state: 'playing' | 'check' | 'checkmate' | 'stalemate'; winner?: Player } => {
      const opponent = currentPlayer === 'w' ? 'b' : 'w';
      const kingPos = findKing(currentPlayer, currentBoard);
      if (!kingPos) return { state: 'playing' };

      const inCheck = isSquareAttacked(kingPos, opponent, currentBoard);

      let hasValidMoves = false;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = currentBoard[r][c];
          if (piece && piece.player === currentPlayer) {
            if (getPieceMoves([r, c], piece, currentBoard).length > 0) {
              hasValidMoves = true;
              break;
            }
          }
        }
        if (hasValidMoves) break;
      }

      if (!hasValidMoves) {
        if (inCheck) return { state: 'checkmate', winner: opponent };
        return { state: 'stalemate' };
      }
      if (inCheck) return { state: 'check' };
      return { state: 'playing' };
    };

    return { getPieceMoves, updateGameState };
  }, []);

  // --- Game Setup ---
  const initializeGame = useCallback(() => {
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
    triggerHapticFeedback();
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // --- Player Interaction ---
  const handleSquareClick = (r: number, c: number) => {
    if (gameState === 'checkmate' || gameState === 'stalemate') return;

    triggerHapticFeedback();

    if (selectedPiece) {
      const [sr, sc] = selectedPiece;
      const isValid = validMoves.some(([vr, vc]) => vr === r && vc === c);

      if (isValid) {
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

        if (pieceToMove.type === 'p' && (r === 0 || r === 7)) {
          pieceToMove.type = 'q';
        }

        const nextTurn = turn === 'w' ? 'b' : 'w';
        const { state, winner } = gameLogic.updateGameState(newBoard, nextTurn);

        setBoard(newBoard);
        setTurn(nextTurn);
        setGameState(state);
        setWinner(winner || null);
        setLastMove({ from: [sr, sc], to: [r, c] });
        setSelectedPiece(null);
        setValidMoves([]);
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

  // --- Rendering ---
  const CapturedPiecesDisplay = ({ player }: { player: Player }) => {
    const captured = capturedPieces[player];
    return (
      <div className="flex flex-wrap items-center gap-1 min-h-[32px] sm:min-h-[40px] text-2xl sm:text-3xl">
        {captured.map((p, i) => (
          <span key={i} className={p.player === 'w' ? 'text-gray-800 dark:text-gray-200' : 'text-gray-800 dark:text-gray-200'}>
            {PIECE_UNICODE[p.player][p.type]}
          </span>
        ))}
      </div>
    )
  };

  const GameStatus = () => {
    let message = '';
    if (gameState === 'checkmate') message = `Checkmate! ${winner === 'w' ? 'White' : 'Black'} wins.`;
    else if (gameState === 'stalemate') message = 'Stalemate! The game is a draw.';
    else if (gameState === 'check') message = `${turn === 'w' ? 'White' : 'Black'} is in check!`;
    else message = `${turn === 'w' ? 'White' : 'Black'} to move`;

    return (
      <div className={`p-3 rounded-lg text-center font-semibold text-lg
            ${gameState === 'checkmate' || gameState === 'stalemate' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/80 dark:bg-slate-800/80'}`}>
        {gameState === 'checkmate' && <Crown className="inline-block mr-2 mb-1" />}
        {message}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-2 sm:p-4 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)] font-sans">
      <div className="w-full flex justify-between items-center mb-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Chess ♟️</h1>
        <button onClick={initializeGame} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow">
          <RefreshCw size={18} /> New Game
        </button>
      </div>
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center lg:items-start gap-4">
        <div className="w-full max-w-md lg:max-w-xl">
          <div className="w-full aspect-square grid grid-cols-8 shadow-2xl rounded-lg overflow-hidden border-4 border-gray-300 dark:border-gray-700">
            {Array(8).fill(null).map((_, r) => Array(8).fill(null).map((_, c) => {
              const piece = board[r]?.[c];
              const isDark = (r + c) % 2 === 1;
              const isSelected = selectedPiece && selectedPiece[0] === r && selectedPiece[1] === c;
              const isMove = validMoves.some(([vr, vc]) => vr === r && vc === c);
              const isLastMove = lastMove && ((lastMove.from[0] === r && lastMove.from[1] === c) || (lastMove.to[0] === r && lastMove.to[1] === c));

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-full aspect-square flex justify-center items-center transition-colors relative
                              ${isDark ? 'bg-slate-500 dark:bg-slate-600' : 'bg-slate-200 dark:bg-slate-300'}
                              cursor-pointer`}
                  onClick={() => handleSquareClick(r, c)}
                >
                  {isLastMove && <div className="absolute inset-0 bg-yellow-400/50" />}
                  {isSelected && <div className="absolute inset-0 ring-4 ring-yellow-500/80 z-10" />}

                  {piece &&
                    <span className={`text-5xl sm:text-6xl md:text-7xl z-0 ${piece.player === 'w' ? 'text-white' : 'text-black'}`} style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                      {PIECE_UNICODE[piece.player][piece.type]}
                    </span>
                  }

                  {isMove && (
                    <div className={`absolute w-full h-full flex justify-center items-center`}>
                      <div className={`w-1/3 h-1/3 rounded-full ${piece ? 'bg-red-500/40 ring-4 ring-red-500/60' : 'bg-gray-900/20'}`}></div>
                    </div>
                  )}
                </div>
              );
            }))}
          </div>
        </div>
        <div className="w-full max-w-md lg:max-w-xs lg:w-1/3 space-y-4">
          <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-lg">
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Captured by White</h3>
            <CapturedPiecesDisplay player="w" />
          </div>
          <GameStatus />
          <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-lg">
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Captured by Black</h3>
            <CapturedPiecesDisplay player="b" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessPage;
