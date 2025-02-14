import { calculateWinner, getValidMoves } from "./gameLogic";

export function aiMove(
  squares,
  difficulty,
  lastMoveIndex,
  gameSize,
  currentMove,
  handlePlay
) {
  let move;
  if (difficulty === "easy") {
    move = getRandomMove(squares, lastMoveIndex, gameSize, currentMove);
  } else if (difficulty === "medium") {
    move = getSmartMove(squares, lastMoveIndex, gameSize, currentMove);
  } else {
    move = getBestMove(squares, lastMoveIndex, gameSize, currentMove, "O"); // Minimax Algorithm
  }

  if (move !== null) {
    const nextSquares = squares.slice();
    nextSquares[move] = "O";
    // console.log(move);
    handlePlay(nextSquares, move);
  }
}

function getRandomMove(squares, lastMoveIndex, gameSize, currentMove) {
  const validMoves = getValidMoves(
    squares,
    lastMoveIndex,
    gameSize,
    currentMove
  );
  return validMoves.length > 0
    ? validMoves[Math.floor(Math.random() * validMoves.length)]
    : null;
}

function getSmartMove(squares, lastMoveIndex, gameSize, currentMove) {
  const validMoves = getValidMoves(
    squares,
    lastMoveIndex,
    gameSize,
    currentMove
  );

  if (validMoves.length === 0) return null;

  for (let i of validMoves) {
    squares[i] = "O";
    if (calculateWinner(squares, gameSize) === "O") return i;
    squares[i] = "X";
    if (calculateWinner(squares, gameSize) === "X") return i;
    squares[i] = null;
  }

  return getRandomMove(squares, lastMoveIndex, gameSize, currentMove);
}

function getBestMove(
  squares,
  lastMoveIndex,
  gameSize,
  currentMove,
  player,
  depthLimit = 6
) {
  const opponent = player === "X" ? "O" : "X";
  const validMoves = getValidMoves(
    squares,
    lastMoveIndex,
    gameSize,
    currentMove
  );

  if (validMoves.length === 0) return -1; // No valid moves left

  function minimax(board, depth, isMaximizing, alpha, beta, currentLastMove) {
    const winner = calculateWinner(board, gameSize);
    if (winner) return winner === player ? 100 - depth : depth - 100;
    if (board.every((square) => square !== null)) return 0; // Draw
    if (depth >= depthLimit) return evaluateBoard(board, player, gameSize);

    let bestScore = isMaximizing ? -Infinity : Infinity;
    const availableMoves = getValidMoves(
      board,
      currentLastMove,
      gameSize,
      currentMove
    );

    for (const move of availableMoves) {
      board[move] = isMaximizing ? player : opponent;
      let score = minimax(board, depth + 1, !isMaximizing, alpha, beta, move);
      board[move] = null; // Undo move

      if (isMaximizing) {
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, score);
      } else {
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, score);
      }

      if (beta <= alpha) break; // Alpha-beta pruning
    }

    return bestScore;
  }

  let bestMove = -1;
  let bestScore = -Infinity;

  for (const move of validMoves) {
    squares[move] = player;
    let moveScore = minimax(squares, 0, false, -Infinity, Infinity, move);
    squares[move] = null;

    if (moveScore > bestScore) {
      bestScore = moveScore;
      bestMove = move;
    }
  }

  return bestMove;
}

// Smarter Evaluation Function
function evaluateBoard(board, player, gameSize) {
  const opponent = player === "X" ? "O" : "X";
  let score = 0;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === player) score += 10;
    else if (board[i] === opponent) score -= 10;
  }

  return score;
}
