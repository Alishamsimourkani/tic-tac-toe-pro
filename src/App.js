import "./styles.css";

import { useState } from "react";
import { useGameState } from "./hooks/useGameState";

import Settings from "./Settings";
import Board from "./Board";
import GameControls from "./GameControls";
import Scoreboard from "./Scoreboard";
import Messages from "./Messages";

export default function Game() {
  const [gameSize, setGameSize] = useState(5);
  const [playerX, setPlayerX] = useState("Fafi");
  const [playerO, setPlayerO] = useState("Ali");
  const [gameMode, setGameMode] = useState("twoPlayer");
  const [difficulty, setDifficulty] = useState("easy");

  const {
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
  } = useGameState(gameSize, gameMode, difficulty);

  const status = winner
    ? `Winner: ${winner} , game will be reset after 5 second`
    : isDraw
    ? "It's a draw!"
    : `${xIsNext ? "X" : "O"} Turn`;

  return (
    <div className="game">
      <Settings
        gameSize={gameSize}
        setGameSize={setGameSize}
        playerX={playerX}
        setPlayerX={setPlayerX}
        playerO={playerO}
        setPlayerO={setPlayerO}
        gameMode={gameMode}
        setGameMode={setGameMode}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />

      <div className="game-board">
        <Board
          gameSize={gameSize}
          xIsNext={xIsNext}
          move={currentMove}
          squares={currentSquares}
          onPlay={handlePlay}
          lastMoveIndex={lastMoveIndex}
        />
        <div className="status">{status}</div>
      </div>
      <div className="info">
        <Messages gameSize={gameSize} currentMove={currentMove} />
        <Scoreboard playerX={playerX} playerO={playerO} score={score} />
        <GameControls
          resetGame={resetGame}
          undoMove={undoMove}
          currentMove={currentMove}
        />
      </div>
    </div>
  );
}
