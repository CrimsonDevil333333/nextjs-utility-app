// src/utils/chess-ai.ts

// This utility file contains non-React, pure JavaScript/TypeScript logic for the chess AI.
// It can be run on the client, or even on the server or in a Web Worker in a more advanced setup.
import { type Board, type Move, type CastlingRights, type Player, type Piece, type PieceType } from '@/app/chess/page'; // Adjust path if needed

// --- Evaluation Constants ---
const pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
const MATE_SCORE = 100000;

// Piece-Square Tables (PSTs) encourage pieces to move to better squares.
const pst: Record<PieceType, number[][]> = {
    p: [
        [0, 0, 0, 0, 0, 0, 0, 0], [50, 50, 50, 50, 50, 50, 50, 50], [10, 10, 20, 30, 30, 20, 10, 10],
        [5, 5, 10, 25, 25, 10, 5, 5], [0, 0, 0, 20, 20, 0, 0, 0], [5, -5, -10, 0, 0, -10, -5, 5],
        [5, 10, 10, -20, -20, 10, 10, 5], [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    n: [
        [-50, -40, -30, -30, -30, -30, -40, -50], [-40, -20, 0, 5, 5, 0, -20, -40], [-30, 5, 10, 15, 15, 10, 5, -30],
        [-30, 0, 15, 20, 20, 15, 0, -30], [-30, 5, 15, 20, 20, 15, 5, -30], [-30, 0, 10, 15, 15, 10, 0, -30],
        [-40, -20, 0, 0, 0, 0, -20, -40], [-50, -40, -30, -30, -30, -30, -40, -50]
    ],
    b: [
        [-20, -10, -10, -10, -10, -10, -10, -20], [-10, 5, 0, 0, 0, 0, 5, -10], [-10, 10, 10, 10, 10, 10, 10, -10],
        [-10, 0, 10, 10, 10, 10, 0, -10], [-10, 5, 5, 10, 10, 5, 5, -10], [-10, 0, 5, 10, 10, 5, 0, -10],
        [-10, 0, 0, 0, 0, 0, 0, -10], [-20, -10, -10, -10, -10, -10, -10, -20]
    ],
    r: [
        [0, 0, 0, 5, 5, 0, 0, 0], [-5, 0, 0, 0, 0, 0, 0, -5], [-5, 0, 0, 0, 0, 0, 0, -5], [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5], [-5, 0, 0, 0, 0, 0, 0, -5], [5, 10, 10, 10, 10, 10, 10, 5], [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    q: [
        [-20, -10, -10, -5, -5, -10, -10, -20], [-10, 0, 5, 0, 0, 0, 0, -10], [-10, 5, 5, 5, 5, 5, 0, -10],
        [0, 0, 5, 5, 5, 5, 0, -5], [-5, 0, 5, 5, 5, 5, 0, -5], [-10, 0, 5, 5, 5, 5, 0, -10],
        [-10, 0, 0, 0, 0, 0, 0, -10], [-20, -10, -10, -5, -5, -10, -10, -20]
    ],
    k: [
        [20, 30, 10, 0, 0, 10, 30, 20], [20, 20, 0, 0, 0, 0, 20, 20], [-10, -20, -20, -20, -20, -20, -20, -10],
        [-20, -30, -30, -40, -40, -30, -30, -20], [-30, -40, -40, -50, -50, -40, -40, -30], [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30], [-30, -40, -40, -50, -50, -40, -40, -30]
    ],
};

/**
 * Evaluates the board from Black's perspective.
 * A positive score is good for Black, negative is good for White.
 */
const evaluateBoard = (board: Board): number => {
    let totalScore = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece) {
                const value = pieceValues[piece.type];
                // The PST is flipped for the white player
                const positionalScore = piece.player === 'b' ? pst[piece.type][r][c] : pst[piece.type][7 - r][c];
                const score = value + positionalScore;
                totalScore += (piece.player === 'b' ? 1 : -1) * score;
            }
        }
    }
    return totalScore;
}


/**
 * A "pure" function to simulate a move on a board state.
 * It returns a new board state without modifying the original.
 * ✅ FIX: This function now correctly updates castling and en passant states.
 */
const makeMoveOnBoard = (board: Board, move: Move, player: Player, currentCastlingRights: CastlingRights) => {
    const newBoard = board.map(r => [...r]);
    const { from, to, promotion } = move;
    const pieceToMove = { ...newBoard[from[0]][from[1]]! };

    // Move piece
    newBoard[to[0]][to[1]] = pieceToMove;
    newBoard[from[0]][from[1]] = null;

    // Handle promotion
    if (promotion) pieceToMove.type = promotion;

    // Handle en passant capture
    if (pieceToMove.type === 'p' && move.from[1] !== move.to[1] && !board[to[0]][to[1]]) {
        const capturedPawnRow = player === 'b' ? to[0] - 1 : to[0] + 1;
        newBoard[capturedPawnRow][to[1]] = null;
    }

    // Handle castling move
    if (pieceToMove.type === 'k' && Math.abs(from[1] - to[1]) === 2) {
        const rookFromCol = to[1] > from[1] ? 7 : 0;
        const rookToCol = to[1] > from[1] ? 5 : 3;
        newBoard[from[0]][rookToCol] = newBoard[from[0]][rookFromCol];
        newBoard[from[0]][rookFromCol] = null;
    }

    // Update castling rights
    const newCastlingRights = JSON.parse(JSON.stringify(currentCastlingRights));
    if (pieceToMove.type === 'k') newCastlingRights[player] = { k: false, q: false };
    if (pieceToMove.type === 'r') {
        if (from[1] === 0) newCastlingRights[player].q = false;
        if (from[1] === 7) newCastlingRights[player].k = false;
    }

    // Set new en passant target for next turn
    const newEnPassantTarget = pieceToMove.type === 'p' && Math.abs(from[0] - to[0]) === 2
        ? [(from[0] + to[0]) / 2, from[1]] as [number, number]
        : null;

    return { newBoard, newCastlingRights, newEnPassantTarget };
}


/**
 * The Negamax search algorithm with alpha-beta pruning.
 */
const negamax = (
    board: Board, depth: number, alpha: number, beta: number, player: Player,
    castlingRights: CastlingRights, enPassantTarget: [number, number] | null,
    getAllValidMoves: (p: Player, b: Board, cr: CastlingRights, et: [number, number] | null) => Move[]
): number => {

    // ✅ FIX: The evaluation is now multiplied by the player's perspective.
    // This ensures the score is always relative to the current player in the search tree.
    if (depth === 0) {
        const perspective = player === 'b' ? 1 : -1;
        return evaluateBoard(board) * perspective;
    }

    const moves = getAllValidMoves(player, board, castlingRights, enPassantTarget);
    if (moves.length === 0) {
        // A simple check for mate/stalemate. A real engine would check if the king is currently attacked.
        return -MATE_SCORE;
    }

    let bestValue = -Infinity;
    for (const move of moves) {
        const { newBoard, newCastlingRights, newEnPassantTarget } = makeMoveOnBoard(board, move, player, castlingRights);

        const value = -negamax(newBoard, depth - 1, -beta, -alpha, player === 'w' ? 'b' : 'w', newCastlingRights, newEnPassantTarget, getAllValidMoves);

        bestValue = Math.max(bestValue, value);
        alpha = Math.max(alpha, value);
        if (alpha >= beta) {
            break; // Beta cutoff
        }
    }
    return bestValue;
}

/**
 * Top-level function to find the best move for the AI (Black).
 */
const findBestMove = (
    board: Board, depth: number, castlingRights: CastlingRights, enPassantTarget: [number, number] | null,
    getAllValidMoves: (p: Player, b: Board, cr: CastlingRights, et: [number, number] | null) => Move[]
) => {
    const analysis: { move: Move; score: number }[] = [];
    const legalMoves = getAllValidMoves('b', board, castlingRights, enPassantTarget);

    let bestScore = -Infinity;
    let bestMove: Move | null = null;

    for (const move of legalMoves) {
        const { newBoard, newCastlingRights, newEnPassantTarget } = makeMoveOnBoard(board, move, 'b', castlingRights);
        // The score returned is from Black's perspective.
        const score = -negamax(newBoard, depth - 1, -Infinity, Infinity, 'w', newCastlingRights, newEnPassantTarget, getAllValidMoves);
        analysis.push({ move, score });

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    analysis.sort((a, b) => b.score - a.score);

    return { bestMove: bestMove ?? legalMoves[0], analysis };
}


export const chessAI = {
    findBestMove,
};