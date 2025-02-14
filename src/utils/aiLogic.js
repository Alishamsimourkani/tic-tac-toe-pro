import { calculateWinner, getValidMoves } from "./gameLogic";
import { getAIMove } from "../openai";

export async function aiMove(
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
  } else if (difficulty === "hard") {
    move = getBestMove(squares, lastMoveIndex, gameSize, currentMove, "O"); // Minimax Algorithm
  } else if (difficulty === "ai") {
    move = await handleAIMove(squares, lastMoveIndex, gameSize, currentMove);
  }

  if (move !== null) {
    const nextSquares = squares.slice();
    nextSquares[move] = "O";
    // console.log(move);
    handlePlay(nextSquares, move);
  }
}

async function handleAIMove(squares, lastMoveIndex, gameSize, currentMove) {
  const validMoves = getValidMoves(
    squares,
    lastMoveIndex,
    gameSize,
    currentMove
  );

  if (validMoves.length === 0) return null;
  const aiMove = await getAIMove(validMoves, squares, lastMoveIndex, gameSize, currentMove);
  console.log(aiMove);
  return aiMove
}

function getRandomMove(squares, lastMoveIndex, gameSize, currentMove) {
  const validMoves = getValidMoves(
    squares,
    lastMoveIndex,
    gameSize,
    currentMove
  );
  console.log(validMoves)
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


const transpositionTable = {}; // Cache for storing previously evaluated positions

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

  // Optimized Minimax function with Memoization and Move Ordering
  function minimax(board, depth, isMaximizing, alpha, beta, currentLastMove) {
    const boardKey = board.join(","); // Unique key for the board state

    // Check if this board state is already calculated
    if (
      transpositionTable[boardKey] &&
      transpositionTable[boardKey].depth >= depth
    ) {
      return transpositionTable[boardKey].score;
    }

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

    // Sort available moves by score (for better pruning)
    const sortedMoves = sortMovesByHeuristic(
      availableMoves,
      board,
      isMaximizing,
      player,
      opponent
    );

    for (const move of sortedMoves) {
      board[move] = isMaximizing ? player : opponent;
      let score = minimax(board, depth + 1, !isMaximizing, alpha, beta, move);
      board[move] = null; // Undo move

      // Update alpha-beta values
      if (isMaximizing) {
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, score);
      } else {
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, score);
      }

      if (beta <= alpha) break; // Alpha-beta pruning
    }

    // Memoize the result for this board state
    transpositionTable[boardKey] = { score: bestScore, depth: depth };
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

// Improved evaluation function with basic heuristics
function evaluateBoard(board, player, gameSize) {
  const opponent = player === "X" ? "O" : "X";
  let score = 0;

  // Count the number of pieces on the board for both players
  for (let i = 0; i < board.length; i++) {
    if (board[i] === player) score += 10;
    else if (board[i] === opponent) score -= 10;
  }

  return score;
}

// Function to sort moves based on a basic heuristic
function sortMovesByHeuristic(moves, board, isMaximizing, player, opponent) {
  const heuristicMoves = moves.map((move) => {
    board[move] = isMaximizing ? player : opponent;
    const score = evaluateBoard(board, player, board.length); // Quick heuristic evaluation
    board[move] = null; // Undo move
    return { move, score };
  });

  // Sort moves based on score (highest first for maximizing, lowest first for minimizing)
  return heuristicMoves
    .sort((a, b) => b.score - a.score)
    .map((move) => move.move);
}



// function getBestMove(
//   squares,
//   lastMoveIndex,
//   gameSize,
//   currentMove,
//   player,
//   depthLimit = 6
// ) {
//   const opponent = player === "X" ? "O" : "X";
//   const validMoves = getValidMoves(
//     squares,
//     lastMoveIndex,
//     gameSize,
//     currentMove
//   );

//   if (validMoves.length === 0) return -1; // No valid moves left

//   function minimax(board, depth, isMaximizing, alpha, beta, currentLastMove) {
//     const winner = calculateWinner(board, gameSize);
//     if (winner) return winner === player ? 100 - depth : depth - 100;
//     if (board.every((square) => square !== null)) return 0; // Draw
//     if (depth >= depthLimit) return evaluateBoard(board, player, gameSize);

//     let bestScore = isMaximizing ? -Infinity : Infinity;
//     const availableMoves = getValidMoves(
//       board,
//       currentLastMove,
//       gameSize,
//       currentMove
//     );

//     for (const move of availableMoves) {
//       board[move] = isMaximizing ? player : opponent;
//       let score = minimax(board, depth + 1, !isMaximizing, alpha, beta, move);
//       board[move] = null; // Undo move

//       if (isMaximizing) {
//         bestScore = Math.max(bestScore, score);
//         alpha = Math.max(alpha, score);
//       } else {
//         bestScore = Math.min(bestScore, score);
//         beta = Math.min(beta, score);
//       }

//       if (beta <= alpha) break; // Alpha-beta pruning
//     }

//     return bestScore;
//   }

//   let bestMove = -1;
//   let bestScore = -Infinity;

//   for (const move of validMoves) {
//     squares[move] = player;
//     let moveScore = minimax(squares, 0, false, -Infinity, Infinity, move);
//     squares[move] = null;

//     if (moveScore > bestScore) {
//       bestScore = moveScore;
//       bestMove = move;
//     }
//   }

//   return bestMove;
// }

// // Smarter Evaluation Function
// function evaluateBoard(board, player, gameSize) {
//   const opponent = player === "X" ? "O" : "X";
//   let score = 0;

//   for (let i = 0; i < board.length; i++) {
//     if (board[i] === player) score += 10;
//     else if (board[i] === opponent) score -= 10;
//   }

//   return score;
// }
