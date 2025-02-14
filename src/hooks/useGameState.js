import { useState, useEffect } from "react";
import { calculateWinner } from "../utils/gameLogic";
import { aiMove } from "../utils/aiLogic";

export function useGameState(gameSize, gameMode, difficulty) {
  const arraySize = gameSize * gameSize;
  const [history, setHistory] = useState([Array(arraySize).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [xIsNext, setXIsNext] = useState(true);
  const [lastMoveIndex, setLastMoveIndex] = useState(null);

  const currentSquares = history[currentMove] || Array(arraySize).fill(null);
  // Check if the game is over (either a winner or a draw)

  const winner = currentSquares
    ? calculateWinner(currentSquares, gameSize)
    : null;
  const isDraw = !winner && currentSquares.every((square) => square !== null);

  useEffect(() => {
    if (winner) {
      setScore((prevScore) => ({
        ...prevScore,
        [winner]: prevScore[winner] + 1,
      }));

      // Reset game after X seconds and start with the winner
      setTimeout(() => {
        setHistory([Array(arraySize).fill(null)]);
        setCurrentMove(0); // Winner starts next game
        setXIsNext(
          gameMode === "singlePlayer" ? true : winner === "O" ? false : true
        ); // Reset to "X" for single-player, otherwise winner starts
        setLastMoveIndex(null); // Reset last move
      }, 5000); // Change 3000 to the desired delay in milliseconds
    }
  }, [winner]);

  function resetGame() {
    setHistory([Array(arraySize).fill(null)]);
    setCurrentMove(0);
    setLastMoveIndex(null); // Reset last move
  }

  function handlePlay(nextSquares, moveIndex) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
    setLastMoveIndex(moveIndex); // Update last move index
  }

  useEffect(() => {
    if (gameMode === "singlePlayer" && !xIsNext && !winner) {
      setTimeout(() => {
        aiMove(
          history[currentMove],
          difficulty,
          lastMoveIndex,
          gameSize,
          currentMove,
          handlePlay
        );
      }, 500);
    }
  }, [xIsNext, gameMode, history, currentMove, winner, difficulty]);

  function undoMove() {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
      setXIsNext(currentMove % 2 !== 0);
      setLastMoveIndex(null); // Reset last move index to allow flexible next moves
    }
  }

  useEffect(() => {
    resetGame(); // Reset game when size changes
  }, [gameSize, gameMode, difficulty]);

  return {
    history,
    currentMove,
    score,
    xIsNext,
    lastMoveIndex,
    winner,
    isDraw,
    currentSquares,
    handlePlay,
    undoMove,
    resetGame,
  };
}
